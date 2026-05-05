from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.md_Order import Order as tbl_Order
from app.schemas.order_schema import (
    OrderCreate,
    OrderRead,
    OrderUpdate,
)

router = APIRouter()


@router.get("/", response_model=list[OrderRead])
async def get_orders(conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Order).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items)
        )
        result = await conex.execute(stmt)
        orders = result.scalars().all()
        return orders
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener pedidos: {str(e)}"
        )


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Order).where(tbl_Order.id == order_id).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items)
        )
        result = await conex.execute(stmt)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )
        return order
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener pedido: {str(e)}"
        )


@router.post("/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate, conex: AsyncSession = Depends(get_db)):
    try:
        nuevo = tbl_Order(**order_data.model_dump(exclude_unset=True))
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        
        # Cargar relaciones explícitamente
        stmt = select(tbl_Order).where(tbl_Order.id == nuevo.id).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items)
        )
        result = await conex.execute(stmt)
        nuevo = result.scalar_one()
        
        return nuevo
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear pedido: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al crear pedido: {str(e)}"
        )


@router.patch("/{order_id}", response_model=OrderRead)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    conex: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(tbl_Order).where(tbl_Order.id == order_id).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items)
        )
        result = await conex.execute(stmt)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )
        
        update_data = order_data.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            return order
        
        for field, value in update_data.items():
            setattr(order, field, value)
        
        await conex.commit()
        await conex.refresh(order)
        return order
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar pedido: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al actualizar pedido: {str(e)}"
        )


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Order).where(tbl_Order.id == order_id)
        result = await conex.execute(stmt)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )
        
        await conex.delete(order)
        await conex.commit()
        return None
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al eliminar pedido: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al eliminar pedido: {str(e)}"
        )
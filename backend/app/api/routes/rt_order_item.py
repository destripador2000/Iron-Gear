from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.md_OrderItem import OrderItem as tbl_OrderItem
from app.schemas.order_item_schema import (
    OrderItemCreate,
    OrderItemRead,
    OrderItemUpdate,
)

router = APIRouter()


@router.get("/", response_model=list[OrderItemRead])
async def get_order_items(conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_OrderItem).options(selectinload(tbl_OrderItem.product))
        result = await conex.execute(stmt)
        items = result.scalars().all()
        return items
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener items: {str(e)}"
        )


@router.get("/{item_id}", response_model=OrderItemRead)
async def get_order_item(item_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_OrderItem).where(tbl_OrderItem.id == item_id).options(selectinload(tbl_OrderItem.product))
        result = await conex.execute(stmt)
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item no encontrado"
            )
        return item
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener item: {str(e)}"
        )


@router.post("/", response_model=OrderItemRead, status_code=status.HTTP_201_CREATED)
async def create_order_item(item_data: OrderItemCreate, conex: AsyncSession = Depends(get_db)):
    try:
        nuevo = tbl_OrderItem(**item_data.model_dump(exclude_unset=True))
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        
        # Cargar relación explícitamente
        stmt = select(tbl_OrderItem).where(tbl_OrderItem.id == nuevo.id).options(selectinload(tbl_OrderItem.product))
        result = await conex.execute(stmt)
        nuevo = result.scalar_one()
        
        return nuevo
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear item: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al crear item: {str(e)}"
        )


@router.patch("/{item_id}", response_model=OrderItemRead)
async def update_order_item(
    item_id: int,
    item_data: OrderItemUpdate,
    conex: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(tbl_OrderItem).where(tbl_OrderItem.id == item_id).options(selectinload(tbl_OrderItem.product))
        result = await conex.execute(stmt)
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item no encontrado"
            )
        
        update_data = item_data.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            return item
        
        for field, value in update_data.items():
            setattr(item, field, value)
        
        await conex.commit()
        await conex.refresh(item)
        return item
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar item: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al actualizar item: {str(e)}"
        )


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order_item(item_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_OrderItem).where(tbl_OrderItem.id == item_id)
        result = await conex.execute(stmt)
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item no encontrado"
            )
        
        await conex.delete(item)
        await conex.commit()
        return None
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al eliminar item: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al eliminar item: {str(e)}"
        )
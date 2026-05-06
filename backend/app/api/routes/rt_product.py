from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.md_Product import Product as tbl_Product
from app.schemas.product_schema import (
    ProductCreate,
    ProductRead,
    ProductUpdate,
)
from app.api.deps import get_current_seller
from app.models.md_User import User

router = APIRouter()


@router.get("/", response_model=list[ProductRead])
async def get_products(conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Product).options(selectinload(tbl_Product.distributor))
        result = await conex.execute(stmt)
        products = result.scalars().all()
        return products
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener productos: {str(e)}"
        )


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Product).where(tbl_Product.id == product_id).options(selectinload(tbl_Product.distributor))
        result = await conex.execute(stmt)
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        return product
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener producto: {str(e)}"
        )


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        nuevo = tbl_Product(**product_data.model_dump(exclude_unset=True))
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        
        # Cargar relación explícitamente para evitar error lazy loading
        stmt = select(tbl_Product).where(tbl_Product.id == nuevo.id).options(selectinload(tbl_Product.distributor))
        result = await conex.execute(stmt)
        nuevo = result.scalar_one()
        
        return nuevo
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear producto: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al crear producto: {str(e)}"
        )


@router.patch("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        stmt = select(tbl_Product).where(tbl_Product.id == product_id).options(selectinload(tbl_Product.distributor))
        result = await conex.execute(stmt)
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        update_data = product_data.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            return product
        
        for field, value in update_data.items():
            setattr(product, field, value)
        
        await conex.commit()
        await conex.refresh(product)
        return product
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar producto: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al actualizar producto: {str(e)}"
        )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        stmt = select(tbl_Product).where(tbl_Product.id == product_id)
        result = await conex.execute(stmt)
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        await conex.delete(product)
        await conex.commit()
        return None
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al eliminar producto: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al eliminar producto: {str(e)}"
        )
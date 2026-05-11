from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.md_Product import Product as tbl_Product
from app.schemas.product_schema import ProductRead
from app.api.deps import get_current_seller
from app.models.md_User import User
from app.core.storage import storage_service

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
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    is_discount: bool = Form(False),
    stock: int = Form(0),
    category: str = Form(...),
    distributor_id: int = Form(...),
    image: Optional[UploadFile] = File(None),
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        # Subir imagen si se proporcionó
        image_url = None
        if image:
            image_url = await storage_service.upload_image(image)
        
        # Crear producto
        product_data = {
            "name": name,
            "description": description,
            "price": price,
            "is_discount": is_discount,
            "stock": stock,
            "category": category,
            "distributor_id": distributor_id,
            "image_url": image_url
        }
        
        nuevo = tbl_Product(**product_data)
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        
        # Cargar relación explícitamente
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
    except HTTPException:
        raise
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
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    is_discount: Optional[bool] = Form(None),
    stock: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    distributor_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    delete_image: bool = Form(False),
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
        
        # Actualizar campos
        if name is not None:
            product.name = name
        if description is not None:
            product.description = description
        if price is not None:
            product.price = price
        if is_discount is not None:
            product.is_discount = is_discount
        if stock is not None:
            product.stock = stock
        if category is not None:
            product.category = category
        if distributor_id is not None:
            product.distributor_id = distributor_id
        
        # Manejar imagen
        if delete_image and product.image_url:
            await storage_service.delete_image(product.image_url)
            product.image_url = None
            image_url = None
        
        if image:
            # Eliminar imagen anterior si existe
            if product.image_url:
                await storage_service.delete_image(product.image_url)
            image_url = await storage_service.upload_image(image)
            product.image_url = image_url
        
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
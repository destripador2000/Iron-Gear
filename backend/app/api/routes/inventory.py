from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.md_Product import Product
from app.models.md_User import User
from app.api.deps import get_current_admin

router = APIRouter(prefix="/inventory", tags=["Inventory"])


class RestockRequest(BaseModel):
    product_id: int
    distributor_id: int
    quantity_added: int = Field(gt=0)


class ProductAlert(BaseModel):
    id: int
    name: str
    stock: int
    category: str


@router.get("/alerts", response_model=list[ProductAlert])
async def get_stock_alerts(
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    stmt = select(Product).where(Product.stock <= 10).order_by(Product.stock.asc())
    result = await conex.execute(stmt)
    products = result.scalars().all()
    
    return [
        ProductAlert(
            id=p.id,
            name=p.name,
            stock=p.stock,
            category=p.category
        )
        for p in products
    ]


@router.post("/restock")
async def restock_product(
    restock_data: RestockRequest,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    stmt = select(Product).where(
        Product.id == restock_data.product_id,
        Product.distributor_id == restock_data.distributor_id
    )
    result = await conex.execute(stmt)
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or does not belong to the specified distributor"
        )
    
    product.stock += restock_data.quantity_added
    await conex.commit()
    await conex.refresh(product)
    
    return {
        "message": "Stock updated successfully",
        "product_id": product.id,
        "new_stock": product.stock
    }
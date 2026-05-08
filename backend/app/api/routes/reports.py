from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.md_OrderItem import OrderItem
from app.models.md_Order import Order
from app.models.md_User import User
from app.models.md_Product import Product
from app.api.deps import get_current_admin

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/top-products")
async def get_top_products(
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    stmt = (
        select(
            OrderItem.product_id,
            Product.name,
            func.sum(OrderItem.quantity).label("total_sold")
        )
        .join(Product, OrderItem.product_id == Product.id)
        .group_by(OrderItem.product_id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
    )
    result = await conex.execute(stmt)
    rows = result.all()
    
    return [
        {
            "product_id": row.product_id,
            "name": row.name,
            "total_sold": int(row.total_sold)
        }
        for row in rows
    ]


@router.get("/top-clients")
async def get_top_clients(
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    stmt = (
        select(
            Order.user_id,
            User.name,
            User.email,
            func.count(Order.id).label("order_count")
        )
        .join(User, Order.user_id == User.id)
        .group_by(Order.user_id, User.name, User.email)
        .order_by(func.count(Order.id).desc())
        .limit(5)
    )
    result = await conex.execute(stmt)
    rows = result.all()
    
    return [
        {
            "user_id": row.user_id,
            "name": row.name,
            "email": row.email,
            "order_count": row.order_count
        }
        for row in rows
    ]


@router.get("/sales")
async def get_sales_summary(
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    stmt = (
        select(func.sum(Order.total_amount).label("total_sales"))
        .where(Order.status.in_(["enviado", "entregado"]))
    )
    result = await conex.execute(stmt)
    total = result.scalar()
    
    return {
        "total_sales": float(total) if total else 0.0,
        "status_filter": "enviado, entregado"
    }
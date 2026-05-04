from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.md_Order import Order
    from app.models.md_Product import Product


# Modelo para la tabla de Detalles de Pedido (Order Items)
class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    frozen_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    # Relación con pedido
    order: Mapped["Order"] = relationship(back_populates="items")

    # Relación con producto
    product: Mapped["Product"] = relationship()

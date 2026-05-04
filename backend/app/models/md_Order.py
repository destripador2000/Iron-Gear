from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.md_User import User
    from app.models.md_OrderItem import OrderItem


# Enum para estados de pedido
class OrderStatus(str, Enum):
    PENDING = "pendiente"    # Pendiente
    SHIPPED = "enviado"      # Enviado
    DELIVERED = "entregado"  # Entregado


# Modelo para la tabla de Pedidos
class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=OrderStatus.PENDING.value)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relación con usuario
    user: Mapped["User"] = relationship(back_populates="orders")

    # Relación con items del pedido
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
from . import BaseSchema
from .user_schema import UserRead
from .order_item_schema import OrderItemRead
from datetime import datetime


class OrderBase(BaseSchema):
    # Campos base para pedidos
    user_id: int
    status: str = "pendiente"
    total_amount: float = 0


class OrderCreate(OrderBase):
    # Esquema para crear pedido - sin ID ni fechas
    pass


class OrderUpdate(BaseSchema):
    # Esquema para actualizar pedido - todos los campos opcionales
    user_id: int | None = None
    status: str | None = None
    total_amount: float | None = None


class OrderRead(OrderBase):
    # Esquema para leer pedido - incluye ID, fechas y relaciones anidadas
    id: int
    created_at: datetime
    updated_at: datetime
    user: UserRead | None = None
    items: list[OrderItemRead] = []
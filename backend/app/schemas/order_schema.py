from pydantic import Field
from . import BaseSchema
from .user_schema import UserRead
from .order_item_schema import OrderItemRead, OrderItemCheckoutRead
from datetime import datetime


class OrderBase(BaseSchema):
    user_id: int
    status: str = "pendiente"
    total_amount: float = 0


class OrderCreate(OrderBase):
    pass


class OrderItemRequest(BaseSchema):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCheckoutRequest(BaseSchema):
    items: list[OrderItemRequest] = Field(min_length=1)


class OrderCheckoutRead(BaseSchema):
    # Esquema para respuesta de checkout sin relaciones anidadas
    id: int
    user_id: int
    status: str
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemCheckoutRead] = []


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
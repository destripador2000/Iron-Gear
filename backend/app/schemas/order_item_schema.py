from . import BaseSchema
from .product_schema import ProductRead


class OrderItemBase(BaseSchema):
    # Campos base para items de pedido
    order_id: int
    product_id: int
    quantity: int
    frozen_price: float


class OrderItemCreate(OrderItemBase):
    # Esquema para crear item - sin ID
    pass


class OrderItemUpdate(BaseSchema):
    # Esquema para actualizar item - todos los campos opcionales
    order_id: int | None = None
    product_id: int | None = None
    quantity: int | None = None
    frozen_price: float | None = None


class OrderItemRead(OrderItemBase):
    # Esquema para leer item - incluye ID y producto anidado
    id: int
    product: ProductRead | None = None
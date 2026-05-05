from pydantic import Field

from . import BaseSchema
from .distributor_schema import DistributorRead


class ProductBase(BaseSchema):
    # Campos base para productos
    distributor_id: int
    name: str = Field(max_length=150)
    description: str | None = Field(default=None, max_length=500)
    price: float
    is_discount: bool = False
    stock: int = 0
    category: str = Field(max_length=50)


class ProductCreate(ProductBase):
    # Esquema para crear producto - sin ID
    pass


class ProductUpdate(BaseSchema):
    # Esquema para actualizar producto - todos los campos opcionales
    distributor_id: int | None = None
    name: str | None = Field(default=None, max_length=150)
    description: str | None = Field(default=None, max_length=500)
    price: float | None = None
    is_discount: bool | None = None
    stock: int | None = None
    category: str | None = Field(default=None, max_length=50)


class ProductRead(ProductBase):
    # Esquema para leer producto - incluye ID y distribuidor anidado
    id: int
    distributor: DistributorRead | None = None
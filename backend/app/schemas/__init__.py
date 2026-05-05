from pydantic import BaseModel, ConfigDict
from datetime import datetime


# Base schema with common config
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


from .distributor_schema import (
    DistributorCreate,
    DistributorRead,
    DistributorUpdate,
)
from .product_schema import (
    ProductCreate,
    ProductRead,
    ProductUpdate,
)
from .user_schema import (
    UserCreate,
    UserRead,
    UserUpdate,
)
from .order_schema import (
    OrderCreate,
    OrderRead,
    OrderUpdate,
)
from .order_item_schema import (
    OrderItemCreate,
    OrderItemRead,
    OrderItemUpdate,
)

__all__ = [
    "BaseSchema",
    # Distributor
    "DistributorCreate",
    "DistributorRead",
    "DistributorUpdate",
    # Product
    "ProductCreate",
    "ProductRead",
    "ProductUpdate",
    # User
    "UserCreate",
    "UserRead",
    "UserUpdate",
    # Order
    "OrderCreate",
    "OrderRead",
    "OrderUpdate",
    # OrderItem
    "OrderItemCreate",
    "OrderItemRead",
    "OrderItemUpdate",
]
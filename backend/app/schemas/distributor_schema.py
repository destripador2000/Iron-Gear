from pydantic import Field

from . import BaseSchema


class DistributorBase(BaseSchema):
    # Campos base para distribuidores
    name: str = Field(max_length=100)
    contact_email: str | None = Field(default=None, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    address: str | None = Field(default=None, max_length=255)
    is_active: bool = True


class DistributorCreate(DistributorBase):
    # Esquema para crear distribuidor - sin ID
    pass


class DistributorUpdate(BaseSchema):
    # Esquema para actualizar distribuidor - todos los campos opcionales
    name: str | None = Field(default=None, max_length=100)
    contact_email: str | None = Field(default=None, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    address: str | None = Field(default=None, max_length=255)
    is_active: bool | None = None


class DistributorRead(DistributorBase):
    # Esquema para leer distribuidor - incluye ID
    id: int
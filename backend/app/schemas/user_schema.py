from pydantic import Field

from . import BaseSchema


class UserBase(BaseSchema):
    # Campos base para usuarios
    name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    role: str = Field(default="cliente", max_length=20)


class UserCreate(UserBase):
    # Esquema para crear usuario - sin ID
    password: str = Field(max_length=255)


class UserUpdate(BaseSchema):
    # Esquema para actualizar usuario - todos los campos opcionales
    name: str | None = Field(default=None, max_length=100)
    email: str | None = Field(default=None, max_length=100)
    password: str | None = Field(default=None, max_length=255)
    role: str | None = Field(default=None, max_length=20)


class UserRead(UserBase):
    # Esquema para leer usuario - incluye ID
    id: int
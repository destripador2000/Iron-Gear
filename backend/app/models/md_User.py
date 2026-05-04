from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.md_Order import Order


# Enum para roles de usuario
class UserRole(str, Enum):
    ADMIN = "administrador"   # Administrador
    SELLER = "vendedor"       # Vendedor
    CLIENT = "cliente"        # Cliente


# Modelo para la tabla de Usuarios
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default=UserRole.CLIENT.value)

    # Relación con pedidos
    orders: Mapped[list["Order"]] = relationship(back_populates="user", cascade="all, delete-orphan")
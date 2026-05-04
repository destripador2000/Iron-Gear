from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.md_Distributor import Distributor


# Enum para categorías de productos
class ProductCategory(str, Enum):
    DUMBBELLS = "mancuernas"  # Mancuernas
    MACHINES = "máquinas"    # Máquinas
    BARS = "barras"          # Barras
    CLOTHING = "ropa"        # Ropa
    SUPPLEMENTS = "suplementos"  # Suplementos
    PHARMACOLOGY = "farmacología deportiva"  # Farmacología deportiva

# Modelo para la tabla de Productos


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    distributor_id: Mapped[int] = mapped_column(ForeignKey("distributors.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    is_discount: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    stock: Mapped[int] = mapped_column(default=0, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relación con distribuidor
    distributor: Mapped["Distributor"] = relationship(back_populates="products")
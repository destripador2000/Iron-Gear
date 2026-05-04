from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models.base import Base

# URL de la base de datos
SQLALCHEMY_DATABASE_URL = settings.database_url

# Creamos el engine asíncrono
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    pool_pre_ping=True
)

# Fábrica de sesiones asíncronas
SessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession
)


# Accedemos a la conexión
async def get_db():
    async with SessionLocal() as session:
        yield session

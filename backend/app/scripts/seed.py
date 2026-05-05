import asyncio
import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from app.models.base import Base
from app.models.md_User import User, UserRole
from app.models.md_Distributor import Distributor
from app.models.md_Product import Product, ProductCategory

# Engine asíncrono para PostgreSQL
engine = create_async_engine(settings.database_url, echo=False)
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession)


async def hash_password(password: str) -> str:
    # Hashear contraseña con bcrypt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


async def seed_users(conex: AsyncSession):
    # Insertar usuarios de prueba
    users_data = [
        {
            "name": "Admin Principal",
            "email": "admin@irongear.com",
            "password": "admin123",
            "role": UserRole.ADMIN.value
        },
        {
            "name": "Juan Vendedor",
            "email": "juan@irongear.com",
            "password": "vendedor123",
            "role": UserRole.SELLER.value
        },
        {
            "name": "Carlos Cliente",
            "email": "carlos@irongear.com",
            "password": "cliente123",
            "role": UserRole.CLIENT.value
        },
    ]
    
    for user_data in users_data:
        # Verificar si usuario ya existe
        stmt = select(User).where(User.email == user_data["email"])
        result = await conex.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"Usuario {user_data['email']} ya existe, saltando...")
            continue
        
        # Hashear contraseña
        password_hash = await hash_password(user_data["password"])
        
        nuevo = User(
            name=user_data["name"],
            email=user_data["email"],
            password_hash=password_hash,
            role=user_data["role"]
        )
        conex.add(nuevo)
        print(f"Usuario {user_data['email']} creado")
    
    await conex.commit()


async def seed_distributors(conex: AsyncSession):
    # Insertar distribuidores
    distributors_data = [
        {
            "name": "Iron Supply Co.",
            "contact_email": "contact@ironsupply.com",
            "phone": "+52 55 1234 5678",
            "address": "Av. Principal 123, Ciudad de México",
            "is_active": True
        },
        {
            "name": "FitWorld Distributors",
            "contact_email": "sales@fitworld.com",
            "phone": "+52 55 9876 5432",
            "address": "Blvd. Fitness 456, Guadalajara",
            "is_active": True
        },
    ]
    
    for dist_data in distributors_data:
        stmt = select(Distributor).where(Distributor.name == dist_data["name"])
        result = await conex.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"Distribuidor {dist_data['name']} ya existe, saltando...")
            continue
        
        nuevo = Distributor(**dist_data)
        conex.add(nuevo)
        print(f"Distribuidor {dist_data['name']} creado")
    
    await conex.commit()


async def seed_products(conex: AsyncSession):
    # Obtener distribuidores existentes
    stmt = select(Distributor)
    result = await conex.execute(stmt)
    distributors = result.scalars().all()
    
    if len(distributors) < 2:
        print("No hay distribuidores suficientes para crear productos")
        return
    
    products_data = [
        # Mancuernas
        {
            "distributor_id": distributors[0].id,
            "name": "Mancuernas Hexagonales 10kg",
            "description": "Mancuernas hexagonales de acero inoxidable, 10kg cada una",
            "price": 1299.00,
            "is_discount": False,
            "stock": 50,
            "category": ProductCategory.DUMBBELLS.value
        },
        {
            "distributor_id": distributors[0].id,
            "name": "Mancuernas Ajustables 5-25kg",
            "description": "Juego de mancuernas ajustables con pesas intercambiables",
            "price": 2499.00,
            "is_discount": True,
            "stock": 25,
            "category": ProductCategory.DUMBBELLS.value
        },
        # Máquinas
        {
            "distributor_id": distributors[1].id,
            "name": "Polea Funcional Profesional",
            "description": "Máquina de poleas múltiples para entrenamiento integral",
            "price": 15999.00,
            "is_discount": False,
            "stock": 5,
            "category": ProductCategory.MACHINES.value
        },
        {
            "distributor_id": distributors[1].id,
            "name": "Prensa de Piernas 45°",
            "description": "Prensa de piernas inclinada para squat y leg press",
            "price": 12500.00,
            "is_discount": True,
            "stock": 8,
            "category": ProductCategory.MACHINES.value
        },
        # Barras
        {
            "distributor_id": distributors[0].id,
            "name": "Barra Olga 20kg",
            "description": "Barra olga profesional de 20kg para mujeres",
            "price": 1899.00,
            "is_discount": False,
            "stock": 30,
            "category": ProductCategory.BARS.value
        },
        {
            "distributor_id": distributors[1].id,
            "name": "Barra EZ 15kg",
            "description": "Barra EZ curl para curl de bíceps",
            "price": 1299.00,
            "is_discount": False,
            "stock": 40,
            "category": ProductCategory.BARS.value
        },
        # Ropa
        {
            "distributor_id": distributors[0].id,
            "name": "Playera Dry-Fit Gym",
            "description": "Playera transpirable con tecnología dry-fit",
            "price": 399.00,
            "is_discount": True,
            "stock": 100,
            "category": ProductCategory.CLOTHING.value
        },
        {
            "distributor_id": distributors[1].id,
            "name": "Leggings Deportivo",
            "description": "Leggings de alto rendimiento para entrenamiento",
            "price": 699.00,
            "is_discount": False,
            "stock": 75,
            "category": ProductCategory.CLOTHING.value
        },
        # Suplementos
        {
            "distributor_id": distributors[0].id,
            "name": "Whey Protein 2kg",
            "description": "Proteína de suero concentrada, sabor vainilla",
            "price": 1099.00,
            "is_discount": False,
            "stock": 60,
            "category": ProductCategory.SUPPLEMENTS.value
        },
        {
            "distributor_id": distributors[1].id,
            "name": "Creatina Monohidratada 300g",
            "description": "Creatina micronizada de grado farmacéutico",
            "price": 449.00,
            "is_discount": True,
            "stock": 80,
            "category": ProductCategory.SUPPLEMENTS.value
        },
        # Farmacología deportiva
        {
            "distributor_id": distributors[0].id,
            "name": "Pre-Entreno Extreme 60cap",
            "description": "Pre-entreno con cafeína, taurina y arginina",
            "price": 599.00,
            "is_discount": False,
            "stock": 45,
            "category": ProductCategory.PHARMACOLOGY.value
        },
        {
            "distributor_id": distributors[1].id,
            "name": "BCAA 120cap",
            "description": "Aminoácidos de cadena ramificada para recuperación",
            "price": 549.00,
            "is_discount": False,
            "stock": 55,
            "category": ProductCategory.PHARMACOLOGY.value
        },
    ]
    
    for prod_data in products_data:
        stmt = select(Product).where(Product.name == prod_data["name"])
        result = await conex.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"Producto {prod_data['name']} ya existe, saltando...")
            continue
        
        nuevo = Product(**prod_data)
        conex.add(nuevo)
        print(f"Producto {prod_data['name']} creado")
    
    await conex.commit()


async def main():
    print("Iniciando seed de datos...")
    
    # Crear tablas si no existen
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with SessionLocal() as conex:
        try:
            await seed_users(conex)
            await seed_distributors(conex)
            await seed_products(conex)
            print("Seed completado exitosamente!")
        except Exception as e:
            await conex.rollback()
            print(f"Error durante el seed: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(main())
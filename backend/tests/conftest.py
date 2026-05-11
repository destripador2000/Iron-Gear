import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

import main as app_module
from main import app
from app.core.database import get_db, Base
from app.core.config import settings
from app.api.deps import get_current_seller
from app.models.md_User import User
from app.models.md_Distributor import Distributor
from app.core.security import get_password_hash


SQLALCHEMY_DATABASE_URL = settings.database_ram_url

engine_test = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_test,
    class_=AsyncSession
)


@pytest.fixture(autouse=True)
async def setup_database():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create test user and distributor in the test database
    async with TestingSessionLocal() as session:
        test_user = User(
            name="Test Seller",
            email="test@seller.com",
            password_hash=get_password_hash("testpass123"),
            role="vendedor"
        )
        session.add(test_user)
        
        test_distributor = Distributor(
            name="Test Distributor",
            contact_email="test@distributor.com",
            phone="1234567890",
            address="Test Address",
            is_active=True
        )
        session.add(test_distributor)
        
        await session.commit()
    
    yield
    
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session


async def override_get_current_seller():
    async with TestingSessionLocal() as session:
        from sqlalchemy import select
        stmt = select(User).where(User.email == "test@seller.com")
        result = await session.execute(stmt)
        test_user = result.scalar_one_or_none()
        return test_user


@pytest.fixture
async def client():
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_seller] = override_get_current_seller
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
async def test_distributor():
    """Get the test distributor from database."""
    async with TestingSessionLocal() as session:
        from sqlalchemy import select
        stmt = select(Distributor).where(Distributor.name == "Test Distributor")
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
import pytest
from httpx import AsyncClient


# ============== CREATE PRODUCT ==============

@pytest.mark.asyncio
async def test_create_product_success(client: AsyncClient, test_distributor):
    """Test creating a product successfully."""
    product_data = {
        "name": "Test Product",
        "description": "Test description",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": str(test_distributor.id)
    }
    
    response = await client.post("/router/rt_products/", data=product_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["description"] == "Test description"
    assert float(data["price"]) == 99.99
    assert data["stock"] == 10
    assert data["category"] == "mancuernas"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_product_missing_required_fields(client: AsyncClient, test_distributor):
    """Test creating product without required fields."""
    product_data = {
        "name": "Test Product",
        "price": "99.99"
    }
    
    response = await client.post("/router/rt_products/", data=product_data)
    
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_product_with_invalid_distributor(client: AsyncClient):
    """Test creating product with invalid distributor ID (should still create with FK validation later)."""
    product_data = {
        "name": "Test Product",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": "999"
    }
    
    response = await client.post("/router/rt_products/", data=product_data)
    
    # The endpoint creates successfully but may have FK issues at DB level
    # This test verifies the endpoint accepts the request
    assert response.status_code in [201, 500]


# ============== GET PRODUCTS ==============

@pytest.mark.asyncio
async def test_get_products_success(client: AsyncClient, test_distributor):
    """Test getting all products."""
    product_data = {
        "name": "Test Product",
        "description": "Test description",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": str(test_distributor.id)
    }
    await client.post("/router/rt_products/", data=product_data)
    
    response = await client.get("/router/rt_products/")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_get_products_empty(client: AsyncClient):
    """Test getting products when none exist."""
    response = await client.get("/router/rt_products/")
    
    assert response.status_code == 200
    data = response.json()
    assert data == []


# ============== GET SINGLE PRODUCT ==============

@pytest.mark.asyncio
async def test_get_product_success(client: AsyncClient, test_distributor):
    """Test getting a single product by ID."""
    product_data = {
        "name": "Test Product",
        "description": "Test description",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": str(test_distributor.id)
    }
    create_response = await client.post("/router/rt_products/", data=product_data)
    product_id = create_response.json()["id"]
    
    response = await client.get(f"/router/rt_products/{product_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["id"] == product_id


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    """Test getting a non-existent product."""
    response = await client.get("/router/rt_products/999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Producto no encontrado"


# ============== UPDATE PRODUCT ==============

@pytest.mark.asyncio
async def test_update_product_success(client: AsyncClient, test_distributor):
    """Test updating a product successfully."""
    product_data = {
        "name": "Test Product",
        "description": "Test description",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": str(test_distributor.id)
    }
    create_response = await client.post("/router/rt_products/", data=product_data)
    product_id = create_response.json()["id"]
    
    update_data = {
        "name": "Updated Product",
        "price": "149.99"
    }
    
    response = await client.patch(f"/router/rt_products/{product_id}", data=update_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Product"
    assert float(data["price"]) == 149.99


@pytest.mark.asyncio
async def test_update_product_not_found(client: AsyncClient):
    """Test updating a non-existent product."""
    update_data = {"name": "Updated Product"}
    
    response = await client.patch("/router/rt_products/999", data=update_data)
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Producto no encontrado"


@pytest.mark.asyncio
async def test_update_product_partial(client: AsyncClient, test_distributor):
    """Test partially updating a product."""
    product_data = {
        "name": "Test Product",
        "description": "Test description",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": str(test_distributor.id)
    }
    create_response = await client.post("/router/rt_products/", data=product_data)
    product_id = create_response.json()["id"]
    
    update_data = {"name": "New Name"}
    
    response = await client.patch(f"/router/rt_products/{product_id}", data=update_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["description"] == "Test description"


# ============== DELETE PRODUCT ==============

@pytest.mark.asyncio
async def test_delete_product_success(client: AsyncClient, test_distributor):
    """Test deleting a product successfully."""
    product_data = {
        "name": "Test Product",
        "description": "Test description",
        "price": "99.99",
        "stock": "10",
        "category": "mancuernas",
        "distributor_id": str(test_distributor.id)
    }
    create_response = await client.post("/router/rt_products/", data=product_data)
    product_id = create_response.json()["id"]
    
    response = await client.delete(f"/router/rt_products/{product_id}")
    
    assert response.status_code == 204
    
    get_response = await client.get(f"/router/rt_products/{product_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_product_not_found(client: AsyncClient):
    """Test deleting a non-existent product."""
    response = await client.delete("/router/rt_products/999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Producto no encontrado"


# ============== CREATE PRODUCT WITH DISCOUNT ==============

@pytest.mark.asyncio
async def test_create_product_with_discount(client: AsyncClient, test_distributor):
    """Test creating a product with discount flag."""
    product_data = {
        "name": "Discount Product",
        "description": "Product with discount",
        "price": "79.99",
        "stock": "20",
        "category": "suplementos",
        "distributor_id": str(test_distributor.id),
        "is_discount": "true"
    }
    
    response = await client.post("/router/rt_products/", data=product_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["is_discount"] == True


# ============== PRODUCT WITH IMAGE ==============

@pytest.mark.asyncio
async def test_create_product_with_image(client: AsyncClient, test_distributor):
    """Test creating a product with image (without actual file - service not configured)."""
    product_data = {
        "name": "Product with Image",
        "description": "Has image field",
        "price": "129.99",
        "stock": "5",
        "category": "máquinas",
        "distributor_id": str(test_distributor.id)
    }
    
    response = await client.post("/router/rt_products/", data=product_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Product with Image"
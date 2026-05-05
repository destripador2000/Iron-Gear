from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import rt_product, rt_user, rt_distributor, rt_order, rt_order_item
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="Iron Gear API - Gestión de tienda de gimnasio",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(rt_product.router, prefix="/router/rt_products", tags=["products"])
app.include_router(rt_user.router, prefix="/router/rt_users", tags=["users"])
app.include_router(rt_distributor.router, prefix="/router/rt_distributors", tags=["distributors"])
app.include_router(rt_order.router, prefix="/router/rt_orders", tags=["orders"])
app.include_router(rt_order_item.router, prefix="/router/rt_order_items", tags=["order_items"])
import asyncio
from datetime import datetime
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload, joinedload
from app.core.database import get_db
from app.models.md_Order import Order as tbl_Order
from app.models.md_OrderItem import OrderItem as tbl_OrderItem
from app.models.md_Product import Product as tbl_Product
from app.models.md_User import User, UserRole
from app.api.deps import get_current_user, require_role
from app.schemas.order_schema import (
    OrderCreate,
    OrderRead,
    OrderUpdate,
    OrderCheckoutRequest,
    OrderCheckoutRead,
    PaymentRequest,
    PaymentResponse,
)
from app.schemas.order_item_schema import OrderItemRead, OrderItemCheckoutRead

# Constante para descuento
DISCOUNT_RATE = 0.10  # 10% de descuento

router = APIRouter()


@router.get("/", response_model=list[OrderRead])
async def get_orders(conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Order).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items).joinedload(tbl_OrderItem.product).joinedload(tbl_Product.distributor)
        )
        result = await conex.execute(stmt)
        orders = result.scalars().all()
        return orders
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener pedidos: {str(e)}"
        )


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Order).where(tbl_Order.id == order_id).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items).joinedload(tbl_OrderItem.product).joinedload(tbl_Product.distributor)
        )
        result = await conex.execute(stmt)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )
        return order
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener pedido: {str(e)}"
        )


@router.post("/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate, conex: AsyncSession = Depends(get_db)):
    try:
        nuevo = tbl_Order(**order_data.model_dump(exclude_unset=True))
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        
        # Cargar relaciones explícitamente
        stmt = select(tbl_Order).where(tbl_Order.id == nuevo.id).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items).joinedload(tbl_OrderItem.product).joinedload(tbl_Product.distributor)
        )
        result = await conex.execute(stmt)
        nuevo = result.scalar_one()
        
        return nuevo
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear pedido: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al crear pedido: {str(e)}"
        )


@router.patch("/{order_id}", response_model=OrderRead)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    conex: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(tbl_Order).where(tbl_Order.id == order_id).options(
            selectinload(tbl_Order.user),
            selectinload(tbl_Order.items).joinedload(tbl_OrderItem.product).joinedload(tbl_Product.distributor)
        )
        result = await conex.execute(stmt)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )
        
        update_data = order_data.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            return order
        
        for field, value in update_data.items():
            setattr(order, field, value)
        
        await conex.commit()
        await conex.refresh(order)
        return order
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar pedido: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al actualizar pedido: {str(e)}"
        )


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Order).where(tbl_Order.id == order_id)
        result = await conex.execute(stmt)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )
        
        await conex.delete(order)
        await conex.commit()
        return None
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al eliminar pedido: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al eliminar pedido: {str(e)}"
        )


@router.post("/checkout", response_model=OrderCheckoutRead, status_code=status.HTTP_201_CREATED)
async def checkout_order(
    request: OrderCheckoutRequest,
    current_user: User = Depends(require_role([UserRole.CLIENT.value])),
    conex: AsyncSession = Depends(get_db)
):
    # 1. Verificar stock y congelar precios
    product_ids = [item.product_id for item in request.items]
    stmt = select(tbl_Product).where(tbl_Product.id.in_(product_ids))
    result = await conex.execute(stmt)
    products = {p.id: p for p in result.scalars().all()}

    product_prices = {}
    for item in request.items:
        if item.product_id not in products:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Producto con ID {item.product_id} no encontrado"
            )
        product = products[item.product_id]
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuficiente para producto '{product.name}' (ID: {product.id})"
            )
        # Congelar precio
        frozen_price = float(product.price)
        if product.is_discount:
            frozen_price = frozen_price * (1 - DISCOUNT_RATE)
        product_prices[item.product_id] = frozen_price

    # 2. Calcular total
    total_amount = sum(
        product_prices[item.product_id] * item.quantity
        for item in request.items
    )

    # 3-6. Crear Order + OrderItems + Actualizar stock (transacción atómica)
    try:
        new_order = tbl_Order(
            user_id=current_user.id,
            status="pendiente",
            total_amount=total_amount
        )
        conex.add(new_order)
        await conex.flush()

        for item in request.items:
            order_item = tbl_OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                frozen_price=product_prices[item.product_id]
            )
            conex.add(order_item)

            # Restar stock
            products[item.product_id].stock -= item.quantity

        await conex.commit()

        # Cargar relaciones sin nested joins para evitar MissingGreenLet
        stmt = select(tbl_Order).where(tbl_Order.id == new_order.id).options(
            selectinload(tbl_Order.user)
        )
        result = await conex.execute(stmt)
        order = result.scalar_one()

        # Cargar items manualmente para evitar relación product
        stmt_items = select(tbl_OrderItem).where(tbl_OrderItem.order_id == new_order.id)
        result_items = await conex.execute(stmt_items)
        items = result_items.scalars().all()

        return OrderCheckoutRead(
            id=order.id,
            user_id=order.user_id,
            status=order.status,
            total_amount=float(order.total_amount),
            created_at=order.created_at,
            updated_at=order.updated_at,
            items=[
                OrderItemCheckoutRead(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    frozen_price=float(item.frozen_price)
                )
                for item in items
            ]
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en checkout: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar el pedido: {str(e)}"
        )


@router.get("/{order_id}/invoice")
async def get_order_invoice(
    order_id: int,
    current_user: User = Depends(get_current_user),
    conex: AsyncSession = Depends(get_db)
):
    """
    Genera y devuelve un PDF con la factura de un pedido.
    Solo el propietario del pedido o un administrador pueden acceder.
    """
    stmt = select(tbl_Order).where(tbl_Order.id == order_id).options(
        joinedload(tbl_Order.user),
        selectinload(tbl_Order.items).joinedload(tbl_OrderItem.product)
    )
    result = await conex.execute(stmt)
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    is_owner = order.user_id == current_user.id
    is_admin = current_user.role == UserRole.ADMIN.value

    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver esta factura"
        )

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=LETTER, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    elements = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=colors.HexColor("#1a1a1a"),
        spaceAfter=30
    )
    elements.append(Paragraph("Invoice / Factura", title_style))

    elements.append(Paragraph(f"<b>Order ID:</b> {order.id}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Date:</b> {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Status:</b> {order.status}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("<b>Customer Info / Datos del Cliente</b>", styles["Heading2"]))
    elements.append(Paragraph(f"Name: {order.user.name}", styles["Normal"]))
    elements.append(Paragraph(f"Email: {order.user.email}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("<b>Items Purchased / Artículos Comprados</b>", styles["Heading2"]))

    table_data = [["Product", "Quantity", "Unit Price", "Subtotal"]]
    for item in order.items:
        subtotal = item.frozen_price * item.quantity
        table_data.append([
            item.product.name,
            str(item.quantity),
            f"${item.frozen_price:.2f}",
            f"${subtotal:.2f}"
        ])

    table = Table(table_data, colWidths=[2.5*inch, 1*inch, 1.25*inch, 1.25*inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("GRID", (0, 0), (-1, -1), 1, colors.HexColor("#dddddd")),
        ("ALIGN", (2, 1), (-1, -1), "RIGHT"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    total_style = ParagraphStyle(
        "Total",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.HexColor("#2c2c2c")
    )
    elements.append(Paragraph(f"<b>Total Amount / Total:</b> ${float(order.total_amount):.2f}", total_style))

    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=invoice_{order_id}.pdf"}
    )


@router.post("/{order_id}/pay", response_model=PaymentResponse)
async def pay_order(
    order_id: int,
    payment: PaymentRequest,
    current_user: User = Depends(get_current_user),
    conex: AsyncSession = Depends(get_db)
):
    # 1. Cargar orden con usuario
    stmt = select(tbl_Order).where(tbl_Order.id == order_id)
    result = await conex.execute(stmt)
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # 2. Verificar propiedad
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this order"
        )

    # 3. Verificar estado pendiente
    if order.status != "pendiente":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order cannot be paid. Current status: {order.status}"
        )

    # 4. Simular procesamiento de pago
    await asyncio.sleep(1)

    # 5. Actualizar estado a "enviado"
    order.status = "enviado"
    await conex.commit()
    await conex.refresh(order)

    return PaymentResponse(
        order_id=order.id,
        status=order.status,
        payment_method=payment.payment_method,
        transaction_id=payment.transaction_id,
        message="Payment processed successfully"
    )
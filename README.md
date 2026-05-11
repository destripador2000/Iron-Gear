# Documentación Técnica y Funcional - E-commerce "Iron Gear"

## Sistema de Gestión Comercial para Equipamiento Deportivo

---

## 1. Introducción y Objetivos del Sistema

### 1.1 Contexto del Proyecto

"Iron Gear" es un sistema de comercio electrónico desarrollado como proyecto académico que simula una plataforma de ventas de equipamiento deportivo de alta gama. El sistema está diseñado para funcionar como un clon minimalista de Amazon, especializado en productos de gimnasio, suplementación y accesorios fitness.

El proyecto surge de la necesidad de implementar un sistema completo de e-commerce que demuestre competencias en desarrollo full-stack, arquitectura de software, gestión de bases de datos y seguridad informática. El contexto universitario permite explorar tecnologías modernas que son estándar en la industria del desarrollo de software.

### 1.2 Objetivos del Sistema

El proyecto persigue objetivos técnicos y funcionales alineados con las competencias profesionales de un ingeniero en sistemas computacionales.

**Objetivos Técnicos:**

- Implementar una arquitectura de software limpia (Clean Architecture) que separe las responsabilidades en capas bien definidas, facilitando el mantenimiento y la escalabilidad del sistema
- Construir una API RESTful completa utilizando FastAPI con tecnología asíncrona, aprovechando las ventajas de rendimiento que ofrece el modelo non-blocking
- Gestionar el estado del frontend de manera eficiente utilizando únicamente herramientas nativas de React, sin dependencias externas que aumenten la complejidad del proyecto
- Implementar seguridad robusta mediante autenticación JWT y control de acceso basado en roles, garantizando que cada usuario tenga acceso únicamente a las funcionalidades permitidas por su rol

**Objetivos Funcionales:**

- Permitir la visualización pública del catálogo de productos organizados por categorías, permitiendo a cualquier visitante explorar el inventario sin necesidad de autenticación
- Gestionar el proceso de compra completo incluyendo navegación por categorías, búsqueda de productos, gestión del carrito de compras, proceso de checkout y facturación automática
- Proporcionar herramientas administrativas completas para la gestión de productos, usuarios y proveedores, incluyendo carga de imágenes al almacenamiento en la nube
- Generar reportes visuales de ventas y gestionar alertas de inventario críticas que notifiquen cuando el stock caiga por debajo de umbrales definidos

### 1.3 Alcance del Sistema

El sistema cubre todo el ciclo de vida comercial, desde la gestión de productos hasta la entrega final al cliente. Los tres roles definidos tienen acceso a funcionalidades específicas que les permiten cumplir con sus responsabilidades dentro de la plataforma.

Para el **Cliente**, el sistema ofrece navegación por el catálogo, búsqueda avanzada con filtros por precio y marca, gestión del carrito de compras, proceso de checkout, seguimiento del estado de pedidos y descarga de facturas en PDF.

Para el **Vendedor**, el sistema permite gestionar el inventario incluyendo CRUD completo de productos con carga de imágenes, gestión de proveedores, actualización de estados de pedidos y monitoreo de alertas de stock.

Para el **Administrador**, el sistema proporciona acceso total incluyendo todas las funcionalidades del vendedor, gestión de usuarios, visualización de reportes de ventas, descarga de facturas de cualquier pedido y configuración del sistema.

---

## 2. Arquitectura Tecnológica

### 2.1 Stack Tecnológico

#### Backend

| Tecnología | Propósito |
|------------|-----------|
| **FastAPI** | Framework web asíncrono de alto rendimiento que permite crear APIs con documentación automática interactiva |
| **PostgreSQL** | Base de datos relacional principal con soporte para transacciones complejas yConstraints de integridad |
| **SQLAlchemy 2.0** | ORM con soporte completo para operaciones asíncronas, mapeo objeto-relacional y gestión de migraciones |
| **Pydantic** | Validación de datos automática, serialización y generación de esquemas JSON para la documentación de la API |
| **Python-Jose** | Implementación de JSON Web Tokens para autenticación stateless segura |
| **Cloudflare R2** | Almacenamiento de imágenes compatível con S3, sin costos de ancho de banda adicional |
| **ReportLab** | Generación de documentos PDF profesionales para facturas |
| **Pytest** | Framework de testing con soporte para pruebas asíncronas y fixtures personalizados |

#### Frontend

| Tecnología | Propósito |
|------------|-----------|
| **React 19** | Biblioteca de componentes para interfaces de usuario con soporte nativo para Server Components |
| **TypeScript** | Tipado estático que permite detectar errores en tiempo de desarrollo y mejorar la mantenibilidad del código |
| **Vite** | Herramienta de build ultrarrápida con hot module replacement para desarrollo fluido |
| **CSS Modules** | Estilos con alcance de componente que eliminan conflictos de nombres y facilitan el mantenimiento |
| **Context API** | Manejo de estado global sin necesidad de librerías externas como Redux |

### 2.2 Arquitectura Limpia (Hexagonal)

El sistema implementa una arquitectura hexagonal basada en capas que sigue los principios de diseño orientado al dominio y separation of concerns. Esta arquitectura permite que cada parte del sistema tenga una responsabilidad única y bien definida, facilitando las pruebas unitarias y el mantenimiento a largo plazo.

La estructura de capas es la siguiente:

**Capa de Presentación (Frontend):** Esta capa contiene todos los componentes React que manejan la interacción con el usuario. Los componentes utilizan Context API para acceder al estado global de autenticación y carrito de compras. Los estilos están completamente aislados mediante CSS Modules, eliminando cualquier posibilidad de conflictos entre selectores.

**Capa de API (FastAPI):** Esta capa expone los endpoints REST que sirven como contrato entre el frontend y el backend. Cada endpoint tiene su correspondiente validación de entrada usando Pydantic y maneja la autenticación mediante dependencias de FastAPI. Los routers organizan los endpoints por dominio funcional.

**Capa de Servicios:** Esta capa contiene la lógica de negocio core del sistema. Aquí se implementan las reglas de validación, transformaciones de datos y orquestación de operaciones. Los servicios son independientes de cómo se recibe la información (HTTP, CLI, etc.) y de cómo se persiste (SQL, NoSQL, etc.).

**Capa de Acceso a Datos:** Esta capa implementa el patrón Repository utilizando SQLAlchemy. Abstrae las operaciones de base de datos permitiendo que los servicios trabajen con objetos del dominio sin conocer los detalles de implementación. Soporta tanto PostgreSQL para producción como SQLite para testing.

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                   Presentación e Interacción                   │
│    Components, Pages, Context, Hooks, CSS Modules              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                    API REST (FastAPI)                          │
│                    Endpoints y Controladores                   │
│    Routers, Dependencies, Pydantic Models, JWT Auth            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS                            │
│               Lógica de Negocio (Use Cases)                    │
│    ProductService, OrderService, UserService, AuthService     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                │
│          Repositorios y ORM (SQLAlchemy)                      │
│    Models, Repositories, Async Session Management             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                                │
│                  PostgreSQL + SQLite (Tests)                   │
│        Transactions, Constraints, Migrations                  │
└─────────────────────────────────────────────────────────────────┘
```

**Justificación de la Arquitectura:**

La elección de una arquitectura limpia se fundamenta en varios factores técnicos y académicos. Primero, permite la separación de responsabilidades donde cada capa tiene un propósito único y bien definido, lo que facilita la identificación de bugs y la implementación de mejoras. Segundo, mejora la testabilidad al permitir que las reglas de negocio se prueben sin necesidad de la base de datos real, utilizando mocks o bases de datos en memoria. Tercero, el mantenimiento se simplifica porque los cambios en una capa no afectan a las demás, siempre que se respete el contrato entre capas. Cuarto, la escalabilidad está garantizada porque la arquitectura permite agregar nuevas funcionalidades sin modificar el código existente, solo extendiendo las capas necesarias.

### 2.3 Estructura de Proyecto

```
Iron-Gear/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── rt_product.py      # Endpoints de productos
│   │   │   │   ├── rt_user.py         # Endpoints de usuarios
│   │   │   │   ├── rt_distributor.py  # Endpoints de proveedores
│   │   │   │   ├── rt_order.py        # Endpoints de pedidos
│   │   │   │   ├── reports.py         # Endpoints de reportes
│   │   │   │   └── inventory.py       # Endpoints de inventario
│   │   │   └── deps.py               # Dependencias compartidas
│   │   ├── core/
│   │   │   ├── config.py             # Configuración global
│   │   │   ├── database.py           # Conexión a DB
│   │   │   ├── security.py           # Funciones de seguridad
│   │   │   └── storage.py           # Servicio de almacenamiento R2
│   │   ├── models/
│   │   │   ├── md_User.py           # Modelo de usuario
│   │   │   ├── md_Product.py        # Modelo de producto
│   │   │   ├── md_Order.py          # Modelo de pedido
│   │   │   ├── md_OrderItem.py      # Modelo de item de pedido
│   │   │   ├── md_Distributor.py    # Modelo de proveedor
│   │   │   └── base.py              # Modelo base
│   │   ├── schemas/
│   │   │   ├── user_schema.py      # Schemas de usuario
│   │   │   ├── product_schema.py   # Schemas de producto
│   │   │   ├── order_schema.py      # Schemas de pedido
│   │   │   └── distributor_schema.py
│   │   ├── scripts/
│   │   │   └── seed.py              # Datos de ejemplo
│   │   └── main.py                  # Punto de entrada
│   ├── tests/
│   │   ├── conftest.py              # Configuración de tests
│   │   ├── pytest.ini
│   │   └── test_rt_product.py        # Pruebas de productos
│   └── .env                         # Variables de entorno
├── frontend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── types.ts              # Tipos globales
│   │   │   ├── product/
│   │   │   │   ├── types.ts         # Tipos de producto
│   │   │   │   └── constants.ts     # Constantes de categorías
│   │   │   ├── auth/
│   │   │   │   └── types.ts         # Tipos de autenticación
│   │   │   └── orders/
│   │   │       └── types.ts         # Tipos de pedidos
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   │   ├── productService.ts
│   │   │   │   ├── productAdminService.ts
│   │   │   │   ├── orderService.ts
│   │   │   │   ├── adminService.ts
│   │   │   │   ├── reportsService.ts
│   │   │   │   └── authService.ts
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── CartContext.tsx
│   │   │   └── hooks/
│   │   │       └── useProducts.ts
│   │   ├── presentation/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── product/
│   │   │   │   └── cart/
│   │   │   └── pages/
│   │   │       ├── home/
│   │   │       ├── dumbbells/
│   │   │       ├── bars/
│   │   │       ├── clothing/
│   │   │       ├── machines/
│   │   │       ├── supplements/
│   │   │       ├── pharmacology/
│   │   │       ├── account/
│   │   │       ├── cart/
│   │   │       ├── checkout/
│   │   │       └── admin/
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## 3. Modelo de Datos y Entidades Principales

### 3.1 Diagrama de Entidades

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │   Product    │       │   Order      │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ name         │       │ distributor_id│─►     │ user_id      │
│ email        │       │ name         │       │ status       │
│ password_hash│       │ description  │       │ total_amount │
│ role         │       │ price        │       │ created_at   │
└──────────────┘       │ stock        │       │ updated_at   │
       │               │ category     │       └──────────────┘
       │               │ is_discount  │              │
       ▼               │ image_url    │              │
┌──────────────┐       └──────────────┘              │
│  Distributor │               │                      │
├──────────────┤               ▼                      ▼
│ id           │       ┌──────────────┐       ┌──────────────┐
│ name         │◄──────│ OrderItem    │◄──────│              │
│ contact_email│       ├──────────────┤       │              │
│ phone        │       │ order_id     │       │              │
│ address      │       │ product_id   │       │              │
│ is_active    │       │ quantity     │       │              │
└──────────────┘       │ frozen_price │       │              │
                       └──────────────┘       │              │
                                              └──────────────┘
```

### 3.2 Descripción de Entidades

#### User (Usuario)

La entidad User representa a todos los usuarios del sistema. Cada usuario tiene un rol específico que determina sus permisos y acceso a las diferentes funcionalidades de la plataforma.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|--------------|
| `id` | Integer | PK, Auto-incremental | Identificador único del usuario |
| `name` | String | Not Null, max 100 | Nombre completo del usuario |
| `email` | String | Unique, Not Null, max 100 | Correo electrónico único |
| `password_hash` | String | Not Null, max 255 | Contraseña encriptada con bcrypt |
| `role` | String | Not Null, max 20 | Rol del usuario: administrador, vendedor, cliente |

**Enumeración de Roles:**
- `administrador`: Acceso completo al sistema, puede gestionar usuarios, ver reportes y eliminar cualquier recurso
- `vendedor`: Gestión de productos, proveedores e inventario, puede actualizar estados de pedidos
- `cliente`: Acceso a compra y descarga de facturas propias, gestión del carrito

#### Product (Producto)

La entidad Product representa los artículos disponibles para venta en la plataforma. Cada producto está asociado a un proveedor y pertenece a una categoría específica.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|--------------|
| `id` | Integer | PK, Auto-incremental | Identificador único del producto |
| `distributor_id` | Integer | FK, Not Null | Referencia al proveedor |
| `name` | String | Not Null, max 150 | Nombre del producto |
| `description` | String | Nullable, max 500 | Descripción detallada |
| `price` | Decimal(10,2) | Not Null | Precio unitario |
| `is_discount` | Boolean | Default False | Indica si tiene descuento activo |
| `stock` | Integer | Default 0 | Cantidad disponible en inventario |
| `category` | String | Not Null, max 50 | Categoría del producto |
| `image_url` | String | Nullable, max 500 | URL de imagen en Cloudflare R2 |

**Enumeración de Categorías:**
- `mancuernas`: Mancuernas y pesas libres
- `barras`: Barras olimpicas y de entrenamiento
- `máquinas`: Máquinas de ejercicio
- `ropa`: Ropa y accesorios fitness
- `suplementos`: Suplementos nutricionales
- `farmacología`: Productos farmacológicos deportivos

#### Order (Pedido)

La entidad Order representa una transacción completada o en proceso. Cada pedido tiene un usuario cliente, un estado que refleja su posición en el flujo de compra, y un monto total calculado.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|--------------|
| `id` | Integer | PK, Auto-incremental | Identificador único del pedido |
| `user_id` | Integer | FK, Not Null | Referencia al cliente |
| `status` | String | Not Null, max 20 | Estado: pendiente, enviado, entregado |
| `total_amount` | Decimal(10,2) | Not Null | Total de la compra |
| `created_at` | DateTime | Default now | Fecha de creación del pedido |
| `updated_at` | DateTime | Auto-update | Última modificación |

**Enumeración de Estados:**
- `pendiente`: Pedido creado, esperando pago
- `enviado`: Pago procesado, en tránsito
- `entregado`: Pedido entregado al cliente

#### OrderItem (Artículo del Pedido)

La entidad OrderItem representa cada producto incluido en un pedido. Almacena la cantidad solicitada y el precio que tenía el producto al momento de la compra (frozen_price), permitiendo mantener un registro histórico preciso independientemente de cambios futuros en el precio del producto.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|--------------|
| `id` | Integer | PK, Auto-incremental | Identificador único |
| `order_id` | Integer | FK, Not Null | Referencia al pedido |
| `product_id` | Integer | FK, Not Null | Referencia al producto |
| `quantity` | Integer | Not Null | Cantidad comprada |
| `frozen_price` | Decimal(10,2) | Not Null | Precio al momento de la compra |

#### Distributor (Proveedor)

La entidad Distributor representa a los proveedores o distribuidores de productos. Cada producto está asociado a un distribuidor específico, permitiendo rastrear el origen de cada artículo y gestionar relaciones comerciales.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|--------------|
| `id` | Integer | PK, Auto-incremental | Identificador único |
| `name` | String | Unique, Not Null, max 100 | Nombre del proveedor |
| `contact_email` | String | Nullable, max 100 | Correo de contacto |
| `phone` | String | Nullable, max 20 | Teléfono de contacto |
| `address` | String | Nullable, max 255 | Dirección física |
| `is_active` | Boolean | Default True | Estado activo/inactivo |

---

## 4. Seguridad y Roles

### 4.1 Sistema de Autenticación JWT

El sistema implementa autenticación stateless mediante JSON Web Tokens (JWT), un estándar abierto (RFC 7519) que permite transmitir información de manera segura entre partes como un objeto JSON.

**Flujo de Autenticación:**

```
1. El usuario envía sus credenciales (email + password) al endpoint
   POST /api/auth/login
   Content-Type: application/x-www-form-urlencoded

2. El backend valida las credenciales contra la base de datos:
   - Busca el usuario por email
   - Verifica la contraseña usando bcrypt
   - Si son válidas, genera un JWT

3. El JWT se construye con:
   - Header: algoritmo de firma (HS256)
   - Payload: {
       "sub": user_id,
       "email": user_email,
       "role": user_role,
       "exp": expiration_timestamp
     }
   - Signature: firma criptográfica con SECRET_KEY

4. El frontend recibe el token y lo almacena en localStorage:
   localStorage.setItem('access_token', jwt_token)

5. Cada request subsiguiente incluye el token en el header:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

6. El backend verifica el token en cada endpoint protegido:
   - Decodifica el JWT usando la SECRET_KEY
   - Verifica que no haya expirado
   - Extrae el user_id del payload
   - Carga el usuario de la base de datos
   - Añade el usuario como dependencia de la ruta
```

**Configuración del Token:**

| Parámetro | Valor |
|-----------|-------|
| Tiempo de expiración | 30 minutos |
| Algoritmo de firma | HS256 |
| Formato de cuerpo | Form URL Encoded (FastAPI OAuth2) |
| Almacenamiento frontend | localStorage |

**Implementación en FastAPI:**

```python
# Generar token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency para obtener usuario actual
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        # Cargar usuario de la base de datos...
    except JWTError:
        raise HTTPException(401, "Token inválido")
```

### 4.2 Control de Acceso Basado en Roles (RBAC)

El sistema define tres roles con permisos específicos que控制an el acceso a diferentes endpoints y funcionalidades. El RBAC (Role-Based Access Control) es un enfoque de control de acceso donde los permisos se asignan a roles en lugar de usuarios directamente.

**Matriz de Permisos:**

| Funcionalidad | Administrador | Vendedor | Cliente |
|--------------|----------------|-----------|----------|
| Ver catálogo público | ✓ | ✓ | ✓ |
| Buscar productos | ✓ | ✓ | ✓ |
| Agregar al carrito | ✓ | ✓ | ✓ |
| Realizar checkout | ✓ | ✓ | ✓ |
| Ver mis pedidos | ✓ | ✓ | ✓ |
| Descargar mi factura | ✓ | ✓ | ✓ |
| Crear productos | ✓ | ✓ | ✗ |
| Editar productos | ✓ | ✓ | ✗ |
| Eliminar productos | ✓ | ✗ | ✗ |
| Gestionar inventario | ✓ | ✓ | ✗ |
| Actualizar estado pedido | ✓ | ✓ | ✗ |
| Gestionar proveedores | ✓ | ✓ | ✗ |
| Gestionar usuarios | ✓ | ✗ | ✗ |
| Ver reportes | ✓ | ✗ | ✗ |
| Ver cualquier factura | ✓ | ✗ | ✗ |

**Implementación en FastAPI:**

```python
# Dependency para requerir rol específico
def require_role(allowed_roles: list[str]):
    async def role_checker(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para realizar esta acción"
            )
        return user
    return role_checker

# Uso en endpoints
@router.post("/products", dependencies=[Depends(require_role(["administrador", "vendedor"]))])
async def create_product(...):
    ...

@router.delete("/products/{id}", dependencies=[Depends(require_role(["administrador"]))])
async def delete_product(...):
    ...
```

**Protección de Endpoints en Frontend:**

El frontend también implementa verificación de permisos basada en el rol del usuario autenticado. Los componentes que requieren permisos específicos verifican el rol antes de renderizar.

```typescript
// Verificación en sidebar
const { user } = useAuthContext();
const canAccessAdmin = user?.role === 'administrador' || user?.role === 'vendedor';
```

---

## 5. Flujo Principal (Compra Completa)

A continuación se describe el recorrido completo de un cliente desde que descubre el sistema hasta que obtiene su factura, detallando cada paso técnico del proceso.

### 5.1 Navegación y Selección de Productos

El flujo comienza cuando el usuario accede a la plataforma y explora el catálogo de productos. El sistema permite múltiples vías de descubrimiento de productos.

**Carga Inicial:**
Cuando el usuario accede a la página de inicio (Home), el componente React realiza una llamada asíncrona al endpoint GET /router/rt_products/. El backend retorna todos los productos y el frontend filtra para mostrar únicamente los 5 productos más recientes. Esta información se combina con el estado global del carrito para determinar si cada producto ya está en el carrito.

**Exploración por Categoría:**
El usuario puede navegar a cualquiera de las seis categorías disponibles haciendo clic en los enlaces del menú de navegación: Mancuernas, Barras, Ropa, Máquinas, Suplementos o Farmacología. Cada página de categoría carga el hook useProducts que filtra los productos según la categoría seleccionada.

**Sistema de Filtros:**
Cada página de categoría incluye un panel lateral (Sidebar) con controles de filtrado. El filtro de precio funciona con un slider que permite seleccionar un rango dinámico: si el usuario selecciona 2000, el sistema filtra productos con precio entre 2000 y 2999. Los filtros de marca permiten seleccionar entre Iron Supply Co y FitWorld Distributors. Los cambios en los filtros se aplican automáticamente sin necesidad de presionar botones adicionales.

**Búsqueda Global:**
La barra de búsqueda en el header permite buscar productos desde cualquier página. El sistema implementa debouncing (300ms) para evitar llamadas excesivas a la API. La búsqueda filtra productos por nombre, descripción y categoría, mostrando hasta 8 resultados en un dropdown.

### 5.2 Gestión del Carrito

Una vez que el usuario encuentra un producto de su interés, puede agregarlo al carrito de compras.

**Agregar al Carrito:**
Al hacer clic en el botón "AGREGAR AL CARRITO", se abre un modal que permite seleccionar la cantidad deseada. El componente AddToCartButton verifica el stock disponible y el estado actual del producto antes de agregarlo. El producto se añade al contexto global del carrito (CartContext), que mantiene el estado sincronizado en toda la aplicación.

**Visualización del Carrito:**
El usuario puede acceder al carrito haciendo clic en el ícono del carrito en el header. La página de carrito muestra todos los productos añadidos con sus respectivas cantidades, permite modificar cantidades o eliminar productos, y calcula el subtotal y total de la compra.

### 5.3 Proceso de Checkout

El checkout es el proceso mediante el cual el usuario transforma su carrito de compras en un pedido real.

**Verificación de Autenticación:**
Al hacer clic en "Proceder al Pago", el sistema verifica si el usuario está autenticado. Si no lo está, redirecciona a la página de inicio de sesión. El cliente debe iniciar sesión o registrarse para continuar.

**Formulario de Envío:**
El usuario completa un formulario con los datos de envío: nombre completo, dirección, teléfono y cualquier nota adicional para la entrega.

**Confirmación del Pedido:**
Al confirmar el pedido, el frontend envía una petición POST al endpoint /router/rt_orders/checkout con la lista de productos del carrito. El backend ejecuta una transacción atómica que incluye los siguientes pasos:

- **Verificación de stock:** Para cada producto en el carrito, se verifica que haya suficiente stock disponible
- **Congelamiento de precios:** Se captura el precio actual de cada producto. Si el producto tiene descuento activo (is_discount=true), se aplica el descuento del 10% y se guarda como frozen_price
- **Cálculo del total:** Se suma el subtotal de todos los productos para obtener el total
- **Creación del pedido:** Se crea el registro en la tabla orders con status="pendiente"
- **Creación de items:** Se crean los registros en la tabla order_items con quantity y frozen_price
- **Actualización de inventario:** Se resta el stock de cada producto según la cantidad comprada
- **Commit atómico:** Si todo es exitoso, se confirma la transacción. Si algo falla, se hace rollback completo

El frontend recibe la respuesta con el ID del pedido creado y limpia el carrito. El usuario es redireccionado a la página de pedidos donde puede ver su nuevo pedido en estado "Pendiente".

### 5.4 Simulación de Pago y Estados del Pedido

Una vez creado el pedido, el cliente puede proceder con el pago simulado.

**Proceso de Pago:**
El cliente hace clic en el botón "Pagar" de su pedido. El frontend envía una petición POST a /router/rt_orders/{order_id}/pay con el método de pago (tarjeta o paypal) y un ID de transacción simulado. El backend simula un procesamiento de espera de 1 segundo y luego actualiza el estado del pedido de "pendiente" a "enviado".

**Estados del Pedido:**
El sistema define tres estados para los pedidos: Pendiente (cuando se crea pero no se ha pagado), Enviado (cuando el pago fue procesado y el vendedor preparó el envío), y Entregado (cuando el cliente confirma la recepción o el administrador actualiza manualmente).

**Actualización por Vendedor:**
Los usuarios con rol de vendedor o administrador pueden cambiar el estado de un pedido utilizando un select en la tabla de pedidos del panel de administración. El endpoint PATCH /router/rt_orders/{order_id} recibe el nuevo estado y lo actualiza en la base de datos.

### 5.5 Generación y Descarga de Factura

La facturación es la funcionalidad final del flujo de compra, permitiendo al cliente obtener un documento legal de su transacción.

**Generación de Factura:**
Cuando el usuario hace clic en el botón "Factura" o "Descargar Invoice", el frontend envía una petición GET al endpoint /router/rt_orders/{order_id}/invoice. El backend verifica que el usuario sea el propietario del pedido o un administrador.

El backend utiliza ReportLab para generar el PDF dinámicamente. El documento incluye: datos del cliente (nombre y email), ID del pedido, fecha de creación, estado actual, lista de productos comprados con cantidad y precio unitario, subtotales por producto, y total general.

**Descarga del Archivo:**
El backend retorna el PDF como un StreamingResponse con el content-type application/pdf. El frontend recibe el blob y crea un enlace temporal para la descarga automática del archivo invoice_{order_id}.pdf.

---

## 6. Manual de Usuario Resumido

### 6.1 Cliente

El cliente es el rol básico de la plataforma. Tiene acceso a todas las funcionalidades de compra pero no puede modificar el contenido del catálogo ni acceder al panel de administración.

**Funcionalidades disponibles:**

- **Navegación:** Acceso a todas las páginas del catálogo sin restricciones. Uso de filtros de precio y marca en cada categoría
- **Búsqueda:** Utilización de la barra de búsqueda global para encontrar productos por nombre, descripción o categoría
- **Carrito de compras:** Agregar productos al carrito, modificar cantidades, eliminar productos, ver subtotales
- **Gestión de cuenta:** Registro de nueva cuenta, inicio de sesión, cierre de sesión
- **Proceso de compra:** Completar formulario de envío, confirmar pedido, simular pago
- **Mis pedidos:** Visualización del historial de pedidos propios, seguimiento de estados (pendiente, enviado, entregado)
- **Facturación:** Descarga de facturas en PDF de todos los pedidos propios

**Limitaciones:**

- No puede crear, editar o eliminar productos
- No puede acceder al panel de administración
- No puede ver reportes de ventas
- No puede gestionar usuarios o proveedores
- Solo puede descargar sus propias facturas

### 6.2 Vendedor

El vendedor tiene responsabilidades operativas relacionadas con la gestión del inventario y atención de pedidos. Su rol está diseñado para empleados que gestionan el día a día de la operación.

**Funcionalidades disponibles:**

- **Gestión de productos:** Crear nuevos productos con nombre, descripción, precio, stock, categoría e imagen. Editar productos existentes. Eliminar productos (con restricción de no poder hacerlo si es el único administrador)
- **Gestión de inventario:** Ver estado de stock de todos los productos. Recibir alertas visuales cuando el stock es menor o igual a 10 unidades. Reabastecer productos mediante la función de restock
- **Gestión de proveedores:** Crear nuevos proveedores. Editar información de proveedores existentes. Eliminar proveedores
- **Atención de pedidos:** Ver todos los pedidos del sistema. Actualizar estado de pedidos (de pendiente a enviado, de enviado a entregado)
- **Facturación:** Descargar facturas de cualquier pedido

**Limitaciones:**

- No puede gestionar usuarios (crear, editar, eliminar)
- No puede acceder a los reportes de ventas del dashboard
- No puede eliminar productos si es el único administrador del sistema

### 6.3 Administrador

El administrador tiene acceso completo a todas las funcionalidades del sistema. Este rol está diseñado para el propietario o manager del negocio que necesita visibilidad y control total.

**Funcionalidades disponibles:**

- **Panel de Resumen (Overview):** Ver ventas totales en formato moneda. Ver productos en alerta de stock crítico. Ver top 5 de productos más vendidos. Ver top 5 de clientes más frecuentes
- **Gestión de Productos:** CRUD completo de productos incluyendo carga de imágenes a Cloudflare R2
- **Gestión de Usuarios:** Ver todos los usuarios del sistema. Crear nuevos usuarios. Eliminar usuarios
- **Gestión de Proveedores:** CRUD completo de proveedores
- **Gestión de Inventario:** Ver alertas de stock. Reabastecer productos
- **Gestión de Pedidos:** Ver todos los pedidos. Actualizar estados. Descargar cualquier factura
- **Reportes:** Acceso completo a todas las métricas y reportes del sistema

**Características especiales:**

- Es el único rol que puede eliminar usuarios
- Puede acceder a cualquier factura del sistema
- Tiene visibilidad completa de todas las métricas de negocio
- Puede delegar responsabilidades asignando el rol de vendedor a otros usuarios

---

## Anexo: Endpoints Principales

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|--------------|----------------|
| POST | /api/auth/login | Inicio de sesión | Público |
| POST | /router/rt_users | Registro de usuario | Público |

### Productos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|--------------|----------------|
| GET | /router/rt_products | Listar productos | Público |
| GET | /router/rt_products/{id} | Ver producto | Público |
| POST | /router/rt_products | Crear producto | Vendedor/Admin |
| PATCH | /router/rt_products/{id} | Editar producto | Vendedor/Admin |
| DELETE | /router/rt_products/{id} | Eliminar producto | Admin |

### Pedidos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|--------------|----------------|
| GET | /router/rt_orders | Listar pedidos | Vendedor/Admin |
| POST | /router/rt_orders/checkout | Crear pedido | Cliente |
| PATCH | /router/rt_orders/{id} | Actualizar estado | Vendedor/Admin |
| POST | /router/rt_orders/{id}/pay | Simular pago | Cliente |
| GET | /router/rt_orders/{id}/invoice | Descargar factura | Cliente/Admin |

### Reportes

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|--------------|----------------|
| GET | /api/reports/sales | Ventas totales | Admin |
| GET | /api/reports/top-products | Top 5 productos | Admin |
| GET | /api/reports/top-clients | Top 5 clientes | Admin |
| GET | /api/inventory/alerts | Alertas de stock | Vendedor/Admin |

### Inventario

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|--------------|----------------|
| POST | /api/inventory/restock | Reabastecer producto | Vendedor/Admin |

---

*Documento generado para evaluación universitaria - Proyecto Iron Gear E-commerce*
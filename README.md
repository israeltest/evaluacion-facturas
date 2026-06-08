# Sistema de Gestión de Facturas

Plataforma integral para el ingreso y gestión de facturas, clientes, productos y usuarios. Desarrollado como prueba técnica cumpliendo con los estándares modernos de desarrollo de software.

## 🚀 Enlaces del Proyecto en Vivo

- **Aplicación Web (Frontend):** [https://israelcevme-001-site1.qtempurl.com/login](https://israelcevme-001-site1.qtempurl.com/login)
  - **Usuario:** `admin`
  - **Contraseña:** `12345`
- **Documentación API (Swagger):** [https://israelcevme-001-site1.qtempurl.com/swagger/index.html](https://israelcevme-001-site1.qtempurl.com/swagger/index.html)

## 🛠️ Tecnologías y Arquitectura

El proyecto está diseñado bajo una arquitectura de n-capas (Clean Architecture) para separar responsabilidades y facilitar la escalabilidad.

### Frontend
- **Framework:** Angular 21
- **Lenguaje:** TypeScript
- **Diseño UI:** Angular Material (Componentes oficiales) y CSS3 Nativo
- **Gráficos:** Chart.js

### Backend
- **Framework:** .NET 10 / C# (API REST)
- **ORM:** Entity Framework Core
- **Seguridad:** Autenticación JWT (JSON Web Tokens)
- **Logs:** Serilog (Manejo global de excepciones)

### Base de Datos
- **Motor:** SQL Server
- **Entregable:** El script completo de generación de base de datos se encuentra en `database_script.sql` en la raíz del backend.

## ✨ Funcionalidades Principales

1. **Dashboard Interactivo:** Gráficos de barras con las ventas mensuales y tablas dinámicas de resumen.
2. **Maestros (CRUD):** 
   - Gestión de Usuarios.
   - Gestión de Clientes.
   - Gestión de Productos (Inventario básico y precios).
3. **Gestión de Facturas:**
   - Creación de facturas con cálculo automático de Subtotal, IVA (13%) y Total.
   - Detalle multicodigo (N productos por factura).
   - Impresión directa a formato PDF.
4. **Búsqueda y Filtros:** Tablas con filtrado dinámico en tiempo real para todos los módulos.

## 📦 Estructura del Repositorio

- `/GestionFactura-Frontend`: Código fuente de la Single Page Application (Angular).
- `/GestionFactura-Backend`: Código fuente de la API (C#).
  - `GestionFactura.Domain`: Entidades e Interfaces base.
  - `GestionFactura.Infrastructure`: Contexto de BD y Repositorios.
  - `GestionFactura.Application`: Lógica de negocio y Servicios.
  - `GestionFactura.Api`: Controladores y configuración de arranque.
- `Modelo_DER.pdf`: Diagrama Entidad-Relación (Generado a partir del HTML de documentación).
- `database_script.sql`: Script de base de datos.

## ⚙️ Instrucciones de Ejecución Local

### 1. Base de Datos
- Ejecutar el script `database_script.sql` en SQL Server Management Studio.

### 2. Backend
1. Navegar a `/GestionFactura-Backend/GestionFactura.Api`
2. Modificar el archivo `appsettings.Development.json` con tu cadena de conexión local.
3. Ejecutar: `dotnet restore` seguido de `dotnet run` (o abrir en Visual Studio y presionar F5).

### 3. Frontend
1. Navegar a `/GestionFactura-Frontend`
2. Instalar dependencias: `npm install`
3. Ejecutar servidor de desarrollo: `npm run dev` o `ng serve`
4. Acceder a `http://localhost:4200`

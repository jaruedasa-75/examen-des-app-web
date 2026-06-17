# Examen Final – Desarrollo de Aplicaciones Web

Aplicación SPA construida con Vue 3, Bootstrap 5 y MockAPI, que permite gestionar Usuarios y Productos mediante operaciones CRUD completas, con autenticación, rutas protegidas, modales y alertas.

## Tecnologías
- Vue.js 3 (Options API)
- Vue Router 4
- Bootstrap 5 + Bootstrap Icons
- Axios
- MockAPI

## Configuración obligatoria antes de ejecutar

### 1. Crear el proyecto en MockAPI
Ingresa a [mockapi.io](https://mockapi.io), crea una cuenta y un nuevo proyecto.

### 2. Crear el recurso `usuarios`
Campos:
| Campo | Tipo |
|---|---|
| nombre | String |
| usuario | String |
| password | String |
| rol | String |

Crea manualmente al menos un registro inicial para poder ingresar por primera vez, por ejemplo:
```json
{ "nombre": "Administrador", "usuario": "admin", "password": "1234", "rol": "Admin" }
```

### 3. Crear el recurso `productos`
Campos:
| Campo | Tipo |
|---|---|
| nombre | String |
| categoria | String |
| precio | Number |
| stock | Number |
| descripcion | String |
| imagen | String |
| tallas | String |
| color | String |
| destacado | Boolean |

Los productos se pueden agregar directamente desde la aplicación una vez esté corriendo (botón "Nuevo producto" en el panel).

### 4. Configurar la URL base
Copia la URL de tu proyecto MockAPI (ej: `https://6839abc123.mockapi.io/api/v1`) y pégala en:
```
src/services/config.js
```
```js
export const API_BASE_URL = 'https://TU_PROYECTO.mockapi.io/api/v1'
```

## Instalación y ejecución
```bash
npm install
npm run serve
```
Abre `http://localhost:8080`.

## Funcionalidades
- Login con validación contra el recurso `usuarios` de MockAPI
- Token simulado guardado en `sessionStorage`
- Rutas protegidas con navigation guards de Vue Router (por sesión y por rol)
- CRUD completo de Usuarios (listar, crear, editar, eliminar) con modales y alertas
- CRUD completo de Productos (listar, crear, editar, eliminar) con modales y alertas
- Catálogo de productos, carrito de compras y pedidos (almacenamiento local)
- Diseño responsivo con Bootstrap 5 e iconos de Bootstrap Icons

## Estructura del proyecto
```
src/
├── assets/             # Estilos globales
├── components/         # Componentes reutilizables (Navbar, Sidebar, Footer, ProductCard)
├── views/               # Vistas (Login, Dashboard, Usuarios, Productos, Catálogo, Carrito, Pedidos)
├── router/              # Definición de rutas y guards
├── services/            # Capa de servicios HTTP (usuarios, productos)
├── utils/               # Utilidades de almacenamiento y sesión
├── App.vue
└── main.js
```

# Sistema de Gestión de Eventos Corporativos

## Documentación Técnica

**Fecha:** Diciembre 2024  
**Versión:** 1.0

---

## 1. Descripción General

Sistema web fullstack para la gestión de eventos corporativos. Permite a las empresas crear eventos, gestionar empleados y controlar las inscripciones.

### Características principales:
- Autenticación con JWT (access + refresh tokens)
- Roles: ADMIN y EMPLOYEE
- CRUD de eventos por empresa
- CRUD de usuarios (solo admins)
- Registro a eventos
- Filtrado de eventos por empresa

---

## 2. Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│     Backend     │────▶│   PostgreSQL    │
│   (React/Vite)  │     │   (Express.js)  │     │    Database     │
│   Puerto: 5173  │     │   Puerto: 3000  │     │   Puerto: 5432  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 3. Estructura del Proyecto

```
prueba_tecnica/
├── src/                    # Backend
│   ├── controllers/        # Lógica de controladores
│   ├── models/             # Modelos Sequelize
│   ├── routes/             # Definición de rutas API
│   ├── services/           # Lógica de negocio
│   ├── middleware/         # Auth, validación, etc.
│   ├── config/             # Configuración DB
│   └── app.js              # Configuración Express
│
├── frontend/               # Frontend React
│   └── src/
│       ├── pages/          # Componentes de página
│       ├── context/        # AuthContext
│       ├── api/            # Configuración Axios
│       └── App.jsx         # Rutas principales
│
└── .env                    # Variables de entorno
```

---

## 4. Modelos de Base de Datos

### Company (Empresa)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | STRING | Nombre de la empresa |
| createdAt | DATE | Fecha de creación |

### Employee (Empleado/Usuario)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | STRING | Nombre completo |
| email | STRING | Email único |
| password | STRING | Hash bcrypt |
| role | ENUM | ADMIN o EMPLOYEE |
| companyId | UUID | FK a Company |

### Event (Evento)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| title | STRING | Título del evento |
| description | TEXT | Descripción |
| date | DATE | Fecha del evento |
| location | STRING | Ubicación |
| capacity | INTEGER | Capacidad máxima |
| companyId | UUID | FK a Company |

### EventRegistration (Inscripción)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| eventId | UUID | FK a Event |
| employeeId | UUID | FK a Employee |
| checkedIn | BOOLEAN | Si asistió |
| registeredAt | DATE | Fecha de registro |

---

## 5. API Endpoints

### Autenticación (`/api/auth`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /register | Crear cuenta |
| POST | /login | Iniciar sesión |
| POST | /refresh-token | Renovar token |
| GET | /me | Usuario actual |

### Eventos (`/api/events`)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | / | Auth | Listar eventos |
| GET | /:id | Auth | Detalle evento |
| POST | / | ADMIN | Crear evento |
| PUT | /:id | ADMIN | Actualizar evento |
| DELETE | /:id | ADMIN | Eliminar evento |

### Inscripciones (`/api/events/:id`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /register | Inscribirse |
| GET | /attendees | Ver asistentes |
| GET | /my-registration | Mi inscripción |

### Empleados (`/api/employees`)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | / | ADMIN | Listar empleados |
| POST | / | ADMIN | Crear empleado |
| PUT | /:id | ADMIN | Actualizar |
| DELETE | /:id | ADMIN | Eliminar |

---

## 6. Flujo de Autenticación

```
1. Usuario → POST /api/auth/login (email, password)
2. Backend → Valida credenciales con bcrypt
3. Backend → Genera accessToken (1h) + refreshToken (7d)
4. Cliente → Guarda tokens en localStorage
5. Cliente → Envía accessToken en header Authorization
6. Middleware → Valida token en cada request protegido
```

### Estructura del Token JWT:
```javascript
{
  id: "uuid-del-usuario",
  email: "usuario@email.com",
  role: "ADMIN" | "EMPLOYEE",
  companyId: "uuid-de-empresa"
}
```

---

## 7. Componentes Frontend

### Login.jsx
- Formulario de inicio de sesión
- Valida email y contraseña
- Redirige al Dashboard tras login exitoso

### Dashboard.jsx
- Header con nombre de empresa y usuario
- Pestañas: Ver Eventos, Crear Evento (admin), Gestionar Usuarios (admin)
- Grid de tarjetas de eventos
- Formulario CRUD de usuarios (solo admin)

### EventDetails.jsx
- Muestra detalle completo del evento
- Botón de inscripción
- Lista de asistentes (solo admin)

---

## 8. Permisos por Rol

| Funcionalidad | EMPLOYEE | ADMIN |
|---------------|----------|-------|
| Ver eventos de su empresa | Si | Si |
| Ver todos los eventos | No | Si |
| Crear eventos | No | Si |
| Editar eventos | No | Si |
| Eliminar eventos | No | Si |
| Inscribirse a eventos | Si | Si |
| Ver lista de asistentes | No | Si |
| Gestionar usuarios | No | Si |

---

## 9. Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=clave_secreta_larga
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=otra_clave_secreta
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 10. Cómo Ejecutar

### Backend:
```bash
cd prueba_tecnica
npm install
npm run dev
```

### Frontend:
```bash
cd prueba_tecnica/frontend
npm install
npm run dev
```

### Base de datos:
1. Crear base de datos PostgreSQL
2. Configurar credenciales en .env
3. Las tablas se crean automáticamente con Sequelize

---

## 11. Tecnologías Utilizadas

### Backend:
- Node.js + Express.js
- Sequelize ORM
- PostgreSQL
- JWT para autenticación
- bcryptjs para hashing
- express-validator

### Frontend:
- React 18 + Vite
- React Router DOM
- Axios
- CSS Modules

---

## 12. Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Tokens JWT con expiración corta
- CORS configurado para orígenes específicos
- Helmet para headers HTTP seguros
- Rate limiting para prevenir ataques
- Validación de entrada en todos los endpoints
- Autorización basada en roles

---

*Sistema de Gestión de Eventos Corporativos - Diciembre 2024*

# 🚀 Task Manager API

[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud%20Functions-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API REST moderna para gestión de tareas construida con **Node.js**, **TypeScript** y **Firebase Cloud Functions**. Implementa **Clean Architecture** y **Domain-Driven Design (DDD)** para máxima escalabilidad y mantenibilidad.

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [⚙️ Configuración](#️-configuración)
- [📡 API Endpoints](#-api-endpoints)
- [🗄️ Modelos de Datos](#️-modelos-de-datos)
- [🔐 Autenticación](#-autenticación)
- [🧪 Testing](#-testing)
- [🛠️ Desarrollo](#️-desarrollo)
- [📦 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)

## 🏗️ Arquitectura

Sigue los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**:

```
src/
├─ domain/                    # 🎯 Núcleo del dominio
│  ├─ entities/              # Entidades de negocio (User, Task)
│  ├─ value-objects/         # Objetos de valor (TaskId, UserId, Email)
│  ├─ enums/                 # Enumeraciones (TaskStatus)
│  ├─ repositories/          # Interfaces de repositorios
│  └─ services/              # Servicios del dominio
├─ application/              # 🎮 Casos de uso
│  ├─ dto/                   # Data Transfer Objects
│  └─ use-cases/             # Lógica de aplicación
├─ infrastructure/           # 🔧 Implementaciones técnicas
│  ├─ config/                # Configuración (Firebase, DI)
│  ├─ persistence/           # Repositorios Firestore
│  ├─ services/              # Servicios externos
│  └─ logger/                # Sistema de logging
├─ interfaces/               # 🌐 Adaptadores
│  └─ http/                  # Controllers y middlewares Express
└─ shared/                   # 📦 Utilidades compartidas
    ├─ errors/               # Errores del dominio
    └─ utils/                # Utilidades genéricas
```

### 🎯 Principios de Diseño

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad específica
- **Inversión de dependencias**: El dominio no depende de infraestructura
- **Testabilidad**: Arquitectura diseñada para testing unitario y de integración
- **Escalabilidad**: Fácil extensión y modificación sin afectar otras capas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 22+
- npm o yarn
- Cuenta de Firebase
- Firebase CLI

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd Atom/functions

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env

# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run serve
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `env.example`:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
LOG_LEVEL=debug
```

### Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Genera una clave privada de servicio
4. Configura las reglas de Firestore

## 📡 API Endpoints

### 🔐 Autenticación

#### Login
```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "usuario@ejemplo.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Registro
```http
POST /v1/auth/register
Content-Type: application/json

{
  "email": "nuevo@ejemplo.com"
}
```

### 👤 Usuarios

#### Buscar por Email
```http
GET /v1/users?email=usuario@ejemplo.com
Authorization: Bearer <token>
```

#### Crear Usuario
```http
POST /v1/users
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "usuario@ejemplo.com"
}
```

### ✅ Tareas (Requieren autenticación)

#### Listar Tareas
```http
GET /v1/tasks
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "task123",
      "title": "Completar documentación",
      "description": "Actualizar README del proyecto",
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Crear Tarea
```http
POST /v1/tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea"
}
```

#### Actualizar Tarea
```http
PUT /v1/tasks/task123
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "status": "COMPLETED"
}
```

#### Eliminar Tarea
```http
DELETE /v1/tasks/task123
Authorization: Bearer <token>
```

### 🏥 Health Check

```http
GET /v1/healthz
```

## 🗄️ Modelos de Datos

### Usuario (`users` collection)

```typescript
interface User {
  id: string;                    // Auto-generado por Firestore
  email: string;                 // Email único (validado)
  createdAt: Timestamp;          // Fecha de creación
}
```

### Tarea (`tasks` collection)

```typescript
interface Task {
  id: string;                    // Auto-generado por Firestore
  userId: string;                // Referencia al usuario propietario
  title: string;                 // Título de la tarea (requerido)
  description: string;           // Descripción (opcional)
  status: TaskStatus;            // PENDING | COMPLETED
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
}

enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}
```

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login/Registro**: El usuario proporciona su email
2. **Generación de JWT**: Se genera un token JWT válido por 24 horas
3. **Autorización**: Incluir token en header `Authorization: Bearer <token>`

### Middleware de Autenticación

```typescript
// Ejemplo de uso en cliente
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

fetch('/v1/tasks', { headers });
```

### Manejo de Errores de Autenticación

```json
{
  "status": "error",
  "message": "Token inválido o expirado",
  "code": 401
}
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage

# Tests específicos
npm test -- --testNamePattern="CreateTaskUseCase"
```

### Estructura de Tests

```
tests/
├─ domain/                     # Tests de entidades y value objects
├─ application/                # Tests de casos de uso
│  └─ use-cases/
├─ infrastructure/             # Tests de integración
└─ interfaces/                 # Tests de controllers y middlewares
    └─ http/
```

### Ejemplo de Test

```typescript
describe('CreateTaskUseCase', () => {
  it('should create a task successfully', async () => {
    const useCase = container.resolve(CreateTaskUseCase);
    const result = await useCase.execute({
      userId: 'user123',
      title: 'Test task',
      description: 'Test description'
    });
    
    expect(result).toBeDefined();
    expect(result.title).toBe('Test task');
  });
});
```

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm run serve        # Servir localmente

# Testing
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura

# Linting y formateo
npm run lint         # ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Prettier

# Firebase
npm run deploy       # Desplegar a Firebase
npm run logs         # Ver logs de Firebase
```

### Estructura de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: añadir endpoint para listar tareas
fix: corregir validación de email
docs: actualizar README
test: añadir tests para CreateTaskUseCase
refactor: simplificar lógica de autenticación
```

### Debugging

```bash
# Logs locales
npm run serve

# Logs de Firebase
npm run logs

# Debug con VS Code
# Configurar launch.json para debugging de Cloud Functions
```

## 📦 Despliegue

### Despliegue a Firebase

```bash
# Configurar proyecto Firebase
firebase use <project-id>

# Desplegar
npm run deploy

# Ver logs
npm run logs
```

### Variables de Entorno en Producción

```bash
# Configurar secretos en Firebase
firebase functions:config:set jwt.secret="your-secret"
firebase functions:config:set firebase.project_id="your-project"
```

### Monitoreo

- **Firebase Console**: Monitoreo de funciones
- **Firebase Analytics**: Métricas de uso
- **Error Reporting**: Captura automática de errores

### Estándares de Código

- **TypeScript**: Configuración estricta
- **ESLint**: Reglas de linting
- **Prettier**: Formateo automático
- **Tests**: Cobertura mínima del 80%

### Checklist de PR

- [ ] Tests pasando
- [ ] Cobertura de tests mantenida
- [ ] Documentación actualizada
- [ ] Linting sin errores
- [ ] Commits siguiendo conventional commits

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 22.x | Runtime de JavaScript |
| **TypeScript** | 5.x | Lenguaje tipado |
| **Express** | 4.x | Framework web |
| **Firebase Functions** | 4.x | Serverless hosting |
| **Firestore** | - | Base de datos NoSQL |
| **JWT** | - | Autenticación |
| **tsyringe** | 4.x | Inyección de dependencias |
| **class-validator** | 0.14.x | Validación de datos |
| **Winston** | 3.x | Sistema de logging |
| **Jest** | 29.x | Framework de testing |

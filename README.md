# 🛠️ Ferretería Backend

API backend desarrollada con **Node.js + TypeScript**, utilizando una arquitectura **feature-driven + hexagonal parcial** con soporte de **decoradores (routing-controllers)**.

---

## 🚀 Tecnologías utilizadas

* Node.js
* TypeScript
* routing-controllers
* PostgreSQL (pg)
* dotenv

---

## 📦 Instalación del proyecto

### 1. Crear proyecto

```bash
npm init -y
```

---

### 2. Instalar dependencias

#### 🔹 Runtime

```bash
npm install express pg dotenv
```

#### 🔹 Desarrollo

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/pg
npm install routing-controllers reflect-metadata
npm install typedi
```

---

## ⚙️ Configuración TypeScript

```bash
npx tsc --init
```

Editar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true
  }
}
```

---

## 📁 Estructura del proyecto

```text
src/
│── config/
│── features/
│   │── categoria/
│   │   │── interfaces/
│   │   │── services/
│   │   │── infrastructure/
│   │   │── models/
│   │   │── categoria.factory.ts
│
│── app.ts
│── server.ts
```

---

## 📂 Creación de directorios

```bash
mkdir -p src/config
mkdir -p src/features/categorias
```

---

## 📄 Archivos base

```bash
touch src/app.ts
touch src/server.ts
```

---

## 🧱 Arquitectura

Este proyecto utiliza:

* Feature-driven design
* Arquitectura hexagonal (parcial)
* Separación de responsabilidades

---

## 🔄 Flujo de ejecución

```text
HTTP Request
    ↓
Controller
    ↓
Service
    ↓
Interface (Port)
    ↓
Repository (Adapter)
    ↓
Database (PostgreSQL)
```

---

## 🧱 Construcción de dependencias (Factory)

El factory se utiliza solo al iniciar la aplicación:

```text
Factory
   ↓
Repository
   ↓
Service
   ↓
Controller (usa el service)
```

---

## ▶️ Ejecutar proyecto

```bash
npm run dev
```

---

## 📌 Endpoints base

```text
GET /api/health
GET /api/categorias
```

---

## ⚠️ Notas importantes

* Se utilizan decoradores en lugar de Express Router
* No se usa un contenedor de dependencias completo (DI manual con factory)
* El factory NO forma parte del flujo de ejecución
* Arquitectura pensada para escalar progresivamente

---

## 🚀 Futuras mejoras

* Validación con DTOs
* Manejo de errores global
* Logging
* Autenticación (JWT)
* Dockerización

---

## 👨‍💻 Autor

Desarrollado por **Diego Muñoz Mauro** 🚀

🛠️ Ferretería Backend

API backend desarrollada con Node.js + TypeScript, utilizando una arquitectura feature-driven + hexagonal parcial con soporte de decoradores (routing-controllers).

🚀 Tecnologías utilizadas

Node.js

TypeScript

Express (routing-controllers)

PostgreSQL (pg)

typedi (opcional / DI)

dotenv

📦 Instalación del proyecto
1. Crear proyecto
npm init -y
2. Instalar dependencias
🔹 Runtime
npm install express pg dotenv
🔹 Desarrollo
npm install -D typescript ts-node-dev @types/node @types/express @types/pg
npm install routing-controllers reflect-metadata
npm install typedi
⚙️ Configuración TypeScript
npx tsc --init

Editar tsconfig.json:

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
📁 Estructura de carpetas
src/
│── config/
│── features/
│   │── categoria/
│   │   │── controller/
│   │   │── services/
│   │   │── infrastructure/
│   │   │── interfaces/
│   │   │── models/
│   │   │── categoria.factory.ts
│
│── app.ts
│── server.ts
📂 Creación de directorios
mkdir -p src/config
mkdir -p src/features/categorias
📄 Archivos base
touch src/app.ts
touch src/server.ts
🧱 Arquitectura del proyecto

Este proyecto sigue una arquitectura basada en:

Feature-driven

Hexagonal (parcial)

Separación de responsabilidades

🔄 Flujo de ejecución
      🌐HTTP REQUEST
             │
             ▼
┌────────────────────────────┐
│     Controller (HTTP)      │
│ex: categoria.controller.ts │
└────────────┬──────────────┘
             │
             ▼
┌────────────────────────────┐
│         Service            │
│ ex: categoria.service.ts   │
│    (lógica de negocio)     │
└────────────┬──────────────┘
             │
             ▼
┌────────────────────────────┐
│        Interface           │
│   ex: CategoriaRepository  │
│   (puerto / contrato)      │
└────────────┬──────────────┘
             │
             ▼
┌────────────────────────────┐
│     Repository (Adapter)   │
│ex: categoria.repository.ts │
│     (PostgreSQL / pg)      │
└────────────┬──────────────┘
             │
             ▼
      🗄️ PostgreSQL DB
      
🧠 Conceptos clave

Controller: Maneja la entrada HTTP

Service: Contiene la lógica de negocio

Interface (Port): Define contratos

Repository (Adapter): Implementa acceso a datos

Factory: Construye dependencias

▶️ Ejecutar proyecto
npm run dev
📌 Endpoints base
GET /api/health
GET /api/categorias
⚠️ Notas importantes

No se utiliza Express Router directamente (se usan decoradores)

No se usa DI container completo (inyección manual con factory)

Arquitectura pensada para escalar progresivamente

🚀 Futuras mejoras

Validación con DTOs

Manejo de errores global

Logging

Autenticación (JWT)

Dockerización

CI/CD
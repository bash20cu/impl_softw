# ClinicaPlus

Proyecto del curso `Implementacion y Mantenimiento de Software`.

ClinicaPlus es un monolito SSR construido con `Next.js`, `TypeScript` y `PostgreSQL`. La aplicacion centraliza la gestion de pacientes, doctores, citas, expedientes y reportes para una clinica pequena.

## Stack

- `Next.js 16` con App Router
- `TypeScript`
- `PostgreSQL 16`
- `Docker Compose` para base de datos local
- `Vercel` para despliegue
- `Git + GitHub` para control de versiones

## Integrantes y responsabilidades

- `Bri`: login y pagina principal
- `Miguel`: base de datos con minimo 10 tablas relacionadas
- `Gabo`: 2 reportes del sistema
- `Migue`: paginas que consumen la base de datos, documentacion y coordinacion tecnica inicial

## Modulos del sistema

- autenticacion
- dashboard
- pacientes
- doctores
- especialidades
- citas
- expedientes
- recetas
- facturacion
- reportes

## Estructura del repositorio

- [app](D:\GitHub\impl_softw\app): rutas SSR del monolito
- [docs](D:\GitHub\impl_softw\docs): documentacion funcional y tecnica
- [db](D:\GitHub\impl_softw\db): esquema SQL e inicializacion local
- [docker-compose.yml](D:\GitHub\impl_softw\docker-compose.yml): contenedor local de PostgreSQL

## Puesta en marcha local

1. Copiar `.env.example` a `.env.local`.
2. Levantar PostgreSQL con `docker compose up -d`.
3. Instalar dependencias con `npm install`.
4. Ejecutar `npm run dev`.

## Acceso demo

El login actual ya funciona con los usuarios sembrados en la base de datos local.

- `admin@clinicaplus.com` / `hash_admin_demo`
- `recepcion@clinicaplus.com` / `hash_recepcion_demo`
- `carlos.vargas@clinicaplus.com` / `hash_doctor_1_demo`
- `sofia.jimenez@clinicaplus.com` / `hash_doctor_2_demo`

Nota:

- Estas credenciales son solo para desarrollo y demo del proyecto.
- La sesion usa una cookie simple y luego redirige al `dashboard`.

## Documentacion inicial

- [docs/propuesta-sistema-clinica.md](D:\GitHub\impl_softw\docs\propuesta-sistema-clinica.md)
- [docs/division-del-proyecto.md](D:\GitHub\impl_softw\docs\division-del-proyecto.md)
- [docs/roadmap-inicial.md](D:\GitHub\impl_softw\docs\roadmap-inicial.md)
- [docs/arquitectura-monolito-ssr.md](D:\GitHub\impl_softw\docs\arquitectura-monolito-ssr.md)
- [docs/diseno-base-de-datos.md](D:\GitHub\impl_softw\docs\diseno-base-de-datos.md)

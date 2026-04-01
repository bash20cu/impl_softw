# Arquitectura monolito SSR

## Decision tecnica

Se adopta una arquitectura monolitica SSR con `Next.js` App Router para mantener el proyecto simple, facil de desplegar y sencillo de explicar en la exposicion.

## Razones para elegir este enfoque

- una sola base de codigo para frontend y backend
- despliegue directo en `Vercel`
- menor complejidad para un proyecto academico
- facilidad para trabajar con componentes del servidor y rutas internas
- mejor mantenibilidad para un equipo pequeno

## Estructura propuesta

- `app/`: rutas y pantallas del sistema
- `lib/`: utilidades compartidas y acceso a base de datos
- `db/`: scripts SQL y recursos de base de datos
- `docs/`: decisiones, division de trabajo y documentacion

## Flujo del sistema

1. El usuario accede al monolito por navegador.
2. `Next.js` renderiza las paginas en el servidor.
3. El backend interno consulta `PostgreSQL`.
4. La respuesta se renderiza como HTML listo para el cliente.

## Primera distribucion por capas

- capa de presentacion: paginas y componentes SSR
- capa de aplicacion: validaciones, reglas y coordinacion de casos de uso
- capa de datos: consultas y conexion a PostgreSQL

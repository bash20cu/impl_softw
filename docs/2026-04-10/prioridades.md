# Tareas urgentes para hoy

## Prioridad 1

- Implementar autenticacion basica real en [app/login/page.tsx](D:\GitHub\impl_softw\app\login\page.tsx) usando la tabla `usuarios`.
- Crear una sesion simple con cookie para permitir acceso controlado al dashboard.
- Redirigir por rol despues del login: `admin`, `recepcionista`, `doctor`.

## Prioridad 2

- Conectar el modulo de reportes a PostgreSQL en lugar de usar solo datos de vista previa.
- Crear una capa de consultas para ejecutar:
  - [db/reports/01-reporte-citas-por-doctor.sql](D:\GitHub\impl_softw\db\reports\01-reporte-citas-por-doctor.sql)
  - [db/reports/02-reporte-pacientes-y-pagos.sql](D:\GitHub\impl_softw\db\reports\02-reporte-pacientes-y-pagos.sql)
- Mostrar resultados reales en [app/reportes/page.tsx](D:\GitHub\impl_softw\app\reportes\page.tsx).

## Prioridad 3

- Crear el modulo de `pacientes` con listado SSR.
- Mostrar columnas base: expediente, nombre, telefono, correo y contacto de emergencia.
- Agregar una pagina de detalle de paciente como base para enlazar expedientes y citas.

## Prioridad 4

- Crear datos demo adicionales para citas, expedientes y pagos si hacen falta mas capturas para la exposicion.
- Probar el flujo local completo:
  - login
  - dashboard
  - reportes
  - consulta de pacientes

## Entregable minimo al final del dia

- login funcional
- reportes leyendo datos reales
- listado de pacientes
- rama actualizada y push al repositorio

## Nota

No es urgente hoy:

- perfeccionar estilos menores
- hacer autorizacion avanzada
- refactorizar a una arquitectura mas compleja

Hoy conviene priorizar funcionalidad visible para demo y exposicion.

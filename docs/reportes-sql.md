# Reportes SQL base

Este documento deja listos los dos reportes sugeridos para la parte de `Gabo`. Ambos usan las tablas relacionadas del modelo de `ClinicaPlus`.

## Reporte 1: citas por doctor y rango de fechas

Archivo:

- [db/reports/01-reporte-citas-por-doctor.sql](D:\GitHub\impl_softw\db\reports\01-reporte-citas-por-doctor.sql)

Objetivo:

- mostrar las citas programadas o atendidas por doctor dentro de un rango de fechas

Filtros:

- `fecha_inicio`
- `fecha_fin`
- `codigo_doctor` opcional

Columnas principales:

- fecha
- hora de inicio
- hora de fin
- estado de la cita
- nombre del paciente
- nombre del doctor
- especialidad
- consultorio
- motivo

Tablas usadas:

- `citas`
- `pacientes`
- `doctores`
- `usuarios`
- `especialidades`
- `consultorios`

## Reporte 2: pacientes atendidos y pagos registrados por periodo

Archivo:

- [db/reports/02-reporte-pacientes-y-pagos.sql](D:\GitHub\impl_softw\db\reports\02-reporte-pacientes-y-pagos.sql)

Objetivo:

- resumir por paciente cuantas consultas fueron atendidas y cuanto dinero se registro en pagos durante un periodo

Filtros:

- `fecha_inicio`
- `fecha_fin`

Columnas principales:

- numero de expediente
- nombre del paciente
- consultas atendidas
- facturas emitidas
- total pagado
- primera atencion del periodo
- ultima atencion del periodo

Tablas usadas:

- `pacientes`
- `expedientes`
- `facturas`
- `pagos`

## Nota de implementacion

Los parametros estan escritos con el formato `:parametro` para que puedan adaptarse facil a una capa de backend, a un cliente SQL o a una futura pagina de reportes en `Next.js`.

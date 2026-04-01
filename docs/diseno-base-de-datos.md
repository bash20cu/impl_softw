# Diseno inicial de la base de datos

## Objetivo

Disenar una base relacional suficiente para soportar la operacion basica de la clinica y cumplir el requisito academico de al menos 10 tablas relacionadas.

## Entregables cubiertos

- diagrama entidad-relacion
- script de creacion de tablas
- relaciones y llaves foraneas
- datos de prueba iniciales

## Tablas

1. `roles`
2. `usuarios`
3. `especialidades`
4. `consultorios`
5. `doctores`
6. `pacientes`
7. `citas`
8. `expedientes`
9. `medicamentos`
10. `recetas`
11. `facturas`
12. `pagos`

## Relaciones clave

- un `rol` puede tener muchos `usuarios`
- un `usuario` doctor se asocia a un registro en `doctores`
- una `especialidad` puede tener muchos `doctores`
- un `paciente` puede tener muchas `citas`
- un `doctor` puede tener muchas `citas`
- una `cita` puede generar un `expediente`
- un `paciente` puede tener muchos `expedientes`
- un `expediente` puede contener muchas `recetas`
- una `receta` referencia un `medicamento`
- un `paciente` puede tener muchas `facturas`
- una `factura` puede registrar muchos `pagos`

## Reportes que habilita este modelo

- citas por doctor y rango de fechas
- pacientes atendidos y pagos por periodo

## Notas de implementacion

- se utilizan UUID como llaves primarias
- se agregan indices sobre llaves foraneas y fechas
- se definieron restricciones `check` para estados y montos
- se separo el esquema de los datos semilla para tener una instalacion mas ordenada
- el esquema principal se encuentra en [db/init/01-schema.sql](D:\GitHub\impl_softw\db\init\01-schema.sql)
- los datos iniciales de prueba se encuentran en [db/init/02-seed.sql](D:\GitHub\impl_softw\db\init\02-seed.sql)
- el diagrama ER se encuentra en [docs/diagrama-entidad-relacion.md](D:\GitHub\impl_softw\docs\diagrama-entidad-relacion.md)

## Relaciones y llaves foraneas

- `usuarios.rol_id -> roles.id`
- `doctores.usuario_id -> usuarios.id`
- `doctores.especialidad_id -> especialidades.id`
- `citas.paciente_id -> pacientes.id`
- `citas.doctor_id -> doctores.id`
- `citas.consultorio_id -> consultorios.id`
- `expedientes.paciente_id -> pacientes.id`
- `expedientes.cita_id -> citas.id`
- `expedientes.doctor_id -> doctores.id`
- `recetas.expediente_id -> expedientes.id`
- `recetas.medicamento_id -> medicamentos.id`
- `facturas.paciente_id -> pacientes.id`
- `facturas.cita_id -> citas.id`
- `pagos.factura_id -> facturas.id`

## Datos de prueba iniciales

La semilla actual incluye:

- 3 roles del sistema
- 3 especialidades medicas
- 3 consultorios
- 4 usuarios
- 2 doctores
- 3 pacientes
- 3 citas
- 2 expedientes
- 3 medicamentos
- 2 recetas
- 3 facturas
- 2 pagos

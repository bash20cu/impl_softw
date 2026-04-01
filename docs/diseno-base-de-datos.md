# Diseno inicial de la base de datos

## Objetivo

Disenar una base relacional suficiente para soportar la operacion basica de la clinica y cumplir el requisito academico de al menos 10 tablas relacionadas.

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
- se incluye una semilla minima para roles
- el archivo base del esquema se encuentra en [db/init/01-schema.sql](D:\GitHub\impl_softw\db\init\01-schema.sql)

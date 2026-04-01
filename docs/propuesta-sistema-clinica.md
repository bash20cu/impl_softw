# Propuesta del sistema ClinicaPlus

## Nombre del proyecto

ClinicaPlus

## Descripcion

ClinicaPlus es una aplicacion web orientada a la gestion operativa de una clinica pequena. Permitira centralizar la informacion de pacientes, doctores, citas, expedientes y pagos en una sola plataforma desplegada en la nube.

La propuesta encaja con los requisitos del curso porque incluye autenticacion, una base de datos relacional amplia, reportes y una estrategia clara de implementacion y mantenimiento de software.

## Objetivo general

Desarrollar una aplicacion web en la nube para administrar procesos clinicos y administrativos de una clinica pequena, utilizando tecnologias modernas y una estrategia de despliegue continuo.

## Objetivos especificos

- implementar un login con validaciones y control de acceso por rol
- modelar una base de datos relacional con al menos 10 tablas
- permitir la gestion de citas y expedientes
- generar reportes utiles para la toma de decisiones
- desplegar la aplicacion en Vercel para facilitar su acceso

## Usuarios del sistema

- administrador
- recepcionista
- doctor

## Funcionalidades principales

- inicio de sesion con validacion de credenciales
- pagina principal con resumen general del sistema
- registro y consulta de pacientes
- registro y consulta de doctores
- gestion de especialidades medicas
- creacion, actualizacion y seguimiento de citas
- registro de expedientes clinicos por paciente
- gestion de recetas y medicamentos
- facturacion y pagos
- visualizacion de reportes

## Modelo inicial de base de datos

Tablas propuestas:

1. `roles`
2. `usuarios`
3. `pacientes`
4. `doctores`
5. `especialidades`
6. `consultorios`
7. `citas`
8. `expedientes`
9. `recetas`
10. `medicamentos`
11. `facturas`
12. `pagos`

## Reportes propuestos

1. Reporte de citas por doctor y rango de fechas.
2. Reporte de pacientes atendidos y pagos registrados por periodo.

## Arquitectura propuesta

- frontend y backend en `Next.js`
- tipado del proyecto con `TypeScript`
- persistencia de datos en `PostgreSQL`
- despliegue en `Vercel`
- control de versiones con `GitHub`

## Estrategia de implementacion y mantenimiento

- uso de ramas en Git para desarrollo controlado
- despliegues de prueba y produccion desde Vercel
- separacion por modulos para facilitar mantenimiento
- documentacion tecnica y funcional desde el inicio
- correccion incremental de errores y liberacion por entregas pequenas


# Task CRUD

## Objetivo

Definir los CRUDs necesarios para que `ClinicaPlus` cumpla de manera visible con los requerimientos del proyecto y deje clara la ruta de implementacion que falta.

## Requerimientos del proyecto que impactan CRUD

- login con validaciones
- base de datos con minimo 10 tablas relacionadas
- 2 reportes usando tablas relacionadas
- aplicacion funcional en la nube

## Estado actual del proyecto

Ya existe:

- login funcional basico
- dashboard SSR
- reportes conectados a PostgreSQL
- CRUD completo de pacientes
- CRUD completo de citas
- CRUD completo de doctores
- base de datos y seed demo

Todavia no existe:

- CRUD de facturas y pagos

## CRUDs prioritarios

### 1. Pacientes

Valor:

- es el modulo mas visible
- conecta con citas, expedientes, facturas y reportes

Requerido:

- crear paciente
- listar pacientes
- ver detalle de paciente
- editar paciente
- eliminar o desactivar paciente

Estado:

- `CRUD` completo listo

Archivos relacionados:

- [app/pacientes/page.tsx](D:\GitHub\impl_softw\app\pacientes\page.tsx)
- [app/pacientes/[id]/page.tsx](D:\GitHub\impl_softw\app\pacientes\[id]\page.tsx)
- [lib/patients.ts](D:\GitHub\impl_softw\lib\patients.ts)

### 2. Citas

Valor:

- conecta pacientes con doctores
- da material fuerte para exponer agenda y reportes

Requerido:

- crear cita
- listar citas
- ver detalle de cita
- editar cita
- cancelar cita

Estado:

- `CRUD` completo listo

### 3. Doctores

Valor:

- necesario para asignar citas y filtrar reportes

Requerido:

- crear doctor
- listar doctores
- ver detalle
- editar doctor
- desactivar doctor

Estado:

- `CRUD` completo listo

### 4. Expedientes

Valor:

- muy importante para la parte clinica del proyecto

Requerido:

- crear expediente desde una cita
- listar expedientes por paciente
- ver expediente
- editar notas o tratamiento

Estado:

- `CRUD` completo listo

### 5. Facturas y pagos

Valor:

- fortalecen la parte administrativa
- alimentan uno de los reportes

Requerido:

- crear factura
- listar facturas
- registrar pago
- ver estado de pago

Estado:

- no hay UI CRUD

## CRUDs secundarios

### Especialidades

- create
- read
- update
- delete logico

### Medicamentos

- create
- read
- update
- delete logico

### Recetas

- create
- read
- update
- delete

### Consultorios

- create
- read
- update
- cambio de estado

## Propuesta minima para cumplir bien

Si el tiempo aprieta, lo mas realista es terminar estos 4 modulos:

1. `Pacientes`
2. `Citas`
3. `Expedientes`
4. `Facturas/Pagos`

Con eso el sistema ya se ve completo y coherente para la exposicion.

## Orden recomendado de implementacion

### Fase 1

- construir `Facturas` con create, list y vista de detalle

### Fase 2

- construir `Pagos` ligados a facturas

### Fase 3

- reforzar modulos secundarios como `Especialidades`, `Consultorios` y `Medicamentos`

## Lo que falta por agregar hoy o proximamente

- modulo `app/facturas`
- modulo `app/pagos`
- acciones de servidor para formularios
- navegacion entre modulos desde dashboard

## Siguiente paso recomendado

Comenzar por `Facturas` y completar:

- formulario de crear factura
- listado general y por paciente
- detalle con estado, monto y cita asociada

Ese es el modulo que mejor prepara el cierre administrativo y conecta directo con el reporte de pagos.

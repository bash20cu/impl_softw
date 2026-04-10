# Checklist de demo

## Flujo recomendado para exponer hoy

1. Levantar la base con `docker compose up -d`.
2. Ejecutar la app con `npm run dev`.
3. Entrar a [http://localhost:3000/login](http://localhost:3000/login).
4. Iniciar sesion con un usuario demo.
5. Revisar:
   - dashboard
   - pacientes
   - detalle de paciente
   - reportes

## Credenciales demo

- `admin@clinicaplus.com` / `hash_admin_demo`
- `recepcion@clinicaplus.com` / `hash_recepcion_demo`
- `carlos.vargas@clinicaplus.com` / `hash_doctor_1_demo`

## Que mostrar en la exposicion

- Login funcional con sesion.
- Dashboard SSR con conexion a PostgreSQL.
- Listado de pacientes y detalle individual.
- Reporte de citas por doctor.
- Reporte de pacientes y pagos por periodo.

## Datos que ya deberian verse

- mas de 5 pacientes
- varias citas en distintos dias
- expedientes con diagnosticos
- facturas en estados `pagada`, `pendiente` y `parcial`
- pagos con diferentes metodos

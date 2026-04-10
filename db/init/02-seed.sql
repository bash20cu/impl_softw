insert into roles (nombre, descripcion)
values
  ('admin', 'Administrador general del sistema'),
  ('recepcionista', 'Gestion de citas, pacientes y pagos'),
  ('doctor', 'Acceso clinico a expedientes y consultas')
on conflict (nombre) do update
set descripcion = excluded.descripcion;

insert into especialidades (nombre, descripcion, activo)
values
  ('Medicina General', 'Consulta general y seguimiento primario', true),
  ('Pediatria', 'Atencion medica para ninos y adolescentes', true),
  ('Cardiologia', 'Control y seguimiento cardiovascular', true)
on conflict (nombre) do update
set descripcion = excluded.descripcion,
    activo = excluded.activo;

insert into consultorios (nombre, ubicacion, piso, estado)
values
  ('Consultorio A', 'Edificio principal', '1', 'disponible'),
  ('Consultorio B', 'Edificio principal', '1', 'disponible'),
  ('Consultorio C', 'Edificio anexo', '2', 'mantenimiento')
on conflict (nombre) do update
set ubicacion = excluded.ubicacion,
    piso = excluded.piso,
    estado = excluded.estado;

insert into usuarios (rol_id, nombre, apellido_1, apellido_2, email, password_hash, telefono, activo)
select r.id, x.nombre, x.apellido_1, x.apellido_2, x.email, x.password_hash, x.telefono, x.activo
from (
  values
    ('admin', 'Laura', 'Mendez', 'Solano', 'admin@clinicaplus.com', 'hash_admin_demo', '8888-1001', true),
    ('recepcionista', 'Andrea', 'Rojas', 'Castro', 'recepcion@clinicaplus.com', 'hash_recepcion_demo', '8888-1002', true),
    ('doctor', 'Carlos', 'Vargas', 'Lopez', 'carlos.vargas@clinicaplus.com', 'hash_doctor_1_demo', '8888-1003', true),
    ('doctor', 'Sofia', 'Jimenez', 'Mora', 'sofia.jimenez@clinicaplus.com', 'hash_doctor_2_demo', '8888-1004', true)
) as x(rol_nombre, nombre, apellido_1, apellido_2, email, password_hash, telefono, activo)
join roles r on r.nombre = x.rol_nombre
on conflict (email) do update
set nombre = excluded.nombre,
    apellido_1 = excluded.apellido_1,
    apellido_2 = excluded.apellido_2,
    telefono = excluded.telefono,
    activo = excluded.activo;

insert into doctores (usuario_id, especialidad_id, codigo_colegiado, fecha_contratacion)
select u.id, e.id, x.codigo_colegiado, x.fecha_contratacion
from (
  values
    ('carlos.vargas@clinicaplus.com', 'Medicina General', 'COL-1001', date '2023-01-15'),
    ('sofia.jimenez@clinicaplus.com', 'Cardiologia', 'COL-1002', date '2024-03-10')
) as x(email, especialidad_nombre, codigo_colegiado, fecha_contratacion)
join usuarios u on u.email = x.email
join especialidades e on e.nombre = x.especialidad_nombre
on conflict (codigo_colegiado) do update
set especialidad_id = excluded.especialidad_id,
    fecha_contratacion = excluded.fecha_contratacion;

insert into pacientes (
  numero_expediente,
  nombre,
  apellido_1,
  apellido_2,
  fecha_nacimiento,
  genero,
  telefono,
  email,
  direccion,
  contacto_emergencia_nombre,
  contacto_emergencia_telefono
)
values
  ('EXP-0001', 'Mariana', 'Salas', 'Arias', date '1992-05-14', 'femenino', '8888-2001', 'mariana.salas@email.com', 'San Jose, Tibas', 'Daniel Salas', '8888-9001'),
  ('EXP-0002', 'Jose', 'Quesada', 'Mora', date '1985-09-03', 'masculino', '8888-2002', 'jose.quesada@email.com', 'Heredia, Belen', 'Ana Mora', '8888-9002'),
  ('EXP-0003', 'Valeria', 'Nunez', 'Campos', date '2001-11-21', 'femenino', '8888-2003', 'valeria.nunez@email.com', 'Alajuela, Grecia', 'Monica Campos', '8888-9003'),
  ('EXP-0004', 'Ricardo', 'Mora', 'Solis', date '1978-02-18', 'masculino', '8888-2004', 'ricardo.mora@email.com', 'Cartago, Tres Rios', 'Lucia Solis', '8888-9004'),
  ('EXP-0005', 'Elena', 'Chaves', 'Pineda', date '1996-07-29', 'femenino', '8888-2005', 'elena.chaves@email.com', 'San Jose, Escazu', 'Marco Chaves', '8888-9005'),
  ('EXP-0006', 'Tomas', 'Arce', 'Villalobos', date '2012-03-05', 'masculino', '8888-2006', 'tomas.arce@email.com', 'Heredia, Santo Domingo', 'Paola Villalobos', '8888-9006')
on conflict (numero_expediente) do update
set nombre = excluded.nombre,
    apellido_1 = excluded.apellido_1,
    apellido_2 = excluded.apellido_2,
    telefono = excluded.telefono,
    email = excluded.email;

insert into medicamentos (nombre, presentacion, descripcion, activo)
values
  ('Acetaminofen', 'Tabletas 500 mg', 'Analgesico y antipiretico', true),
  ('Ibuprofeno', 'Capsulas 400 mg', 'Antiinflamatorio no esteroideo', true),
  ('Losartan', 'Tabletas 50 mg', 'Tratamiento de hipertension arterial', true),
  ('Amoxicilina', 'Capsulas 500 mg', 'Antibiotico de amplio espectro', true),
  ('Salbutamol', 'Inhalador', 'Broncodilatador de accion rapida', true)
on conflict (nombre) do update
set presentacion = excluded.presentacion,
    descripcion = excluded.descripcion,
    activo = excluded.activo;

insert into citas (
  paciente_id,
  doctor_id,
  consultorio_id,
  fecha,
  hora_inicio,
  hora_fin,
  estado,
  motivo,
  observaciones
)
select p.id, d.id, c.id, x.fecha, x.hora_inicio, x.hora_fin, x.estado, x.motivo, x.observaciones
from (
  values
    ('EXP-0001', 'COL-1001', 'Consultorio A', date '2026-04-06', time '08:00', time '08:30', 'confirmada', 'Control general', 'Paciente estable'),
    ('EXP-0002', 'COL-1002', 'Consultorio B', date '2026-04-06', time '09:00', time '09:45', 'programada', 'Revision cardiologica', 'Traer examenes previos'),
    ('EXP-0003', 'COL-1001', 'Consultorio A', date '2026-04-07', time '10:00', time '10:30', 'atendida', 'Dolor de garganta', 'Se realizo valoracion completa'),
    ('EXP-0004', 'COL-1002', 'Consultorio B', date '2026-04-08', time '11:00', time '11:45', 'atendida', 'Control de presion arterial', 'Paciente con mejoria'),
    ('EXP-0005', 'COL-1001', 'Consultorio A', date '2026-04-08', time '13:00', time '13:30', 'confirmada', 'Migraña recurrente', 'Pendiente valoracion completa'),
    ('EXP-0006', 'COL-1001', 'Consultorio A', date '2026-04-09', time '15:00', time '15:30', 'atendida', 'Tos persistente', 'Se sugiere seguimiento pediatrico'),
    ('EXP-0002', 'COL-1002', 'Consultorio B', date '2026-04-10', time '08:30', time '09:15', 'confirmada', 'Electrocardiograma de control', 'Traer resultados de laboratorio')
) as x(expediente_numero, codigo_colegiado, consultorio_nombre, fecha, hora_inicio, hora_fin, estado, motivo, observaciones)
join pacientes p on p.numero_expediente = x.expediente_numero
join doctores d on d.codigo_colegiado = x.codigo_colegiado
left join consultorios c on c.nombre = x.consultorio_nombre
where not exists (
  select 1
  from citas ci
  where ci.paciente_id = p.id
    and ci.doctor_id = d.id
    and ci.fecha = x.fecha
    and ci.hora_inicio = x.hora_inicio
);

insert into expedientes (
  paciente_id,
  cita_id,
  doctor_id,
  diagnostico,
  sintomas,
  tratamiento,
  notas,
  fecha_registro
)
select p.id, ci.id, d.id, x.diagnostico, x.sintomas, x.tratamiento, x.notas, x.fecha_registro
from (
  values
    ('EXP-0001', 'COL-1001', date '2026-04-06', time '08:00', 'Control general sin hallazgos graves', 'Fatiga leve', 'Hidratacion y seguimiento anual', 'Se recomienda perfil sanguineo', timestamptz '2026-04-06 08:40:00-06'),
    ('EXP-0003', 'COL-1001', date '2026-04-07', time '10:00', 'Faringitis aguda', 'Dolor de garganta y fiebre', 'Acetaminofen e hidratacion', 'Reposo por 3 dias', timestamptz '2026-04-07 10:40:00-06'),
    ('EXP-0004', 'COL-1002', date '2026-04-08', time '11:00', 'Hipertension controlada', 'Mareo ocasional y cefalea leve', 'Mantener losartan y control mensual', 'Reducir consumo de sodio', timestamptz '2026-04-08 11:55:00-06'),
    ('EXP-0006', 'COL-1001', date '2026-04-09', time '15:00', 'Bronquitis leve', 'Tos seca persistente y congestion', 'Salbutamol y control en una semana', 'Vigilar fiebre nocturna', timestamptz '2026-04-09 15:40:00-06')
) as x(expediente_numero, codigo_colegiado, fecha, hora_inicio, diagnostico, sintomas, tratamiento, notas, fecha_registro)
join pacientes p on p.numero_expediente = x.expediente_numero
join doctores d on d.codigo_colegiado = x.codigo_colegiado
join citas ci on ci.paciente_id = p.id and ci.doctor_id = d.id and ci.fecha = x.fecha and ci.hora_inicio = x.hora_inicio
where not exists (
  select 1
  from expedientes ex
  where ex.cita_id = ci.id
);

insert into recetas (
  expediente_id,
  medicamento_id,
  dosis,
  frecuencia,
  duracion,
  indicaciones
)
select ex.id, m.id, x.dosis, x.frecuencia, x.duracion, x.indicaciones
from (
  values
    ('EXP-0003', timestamptz '2026-04-07 10:40:00-06', 'Acetaminofen', '500 mg', 'Cada 8 horas', '3 dias', 'Tomar despues de las comidas'),
    ('EXP-0001', timestamptz '2026-04-06 08:40:00-06', 'Ibuprofeno', '400 mg', 'Cada 12 horas', '2 dias', 'Solo si presenta dolor muscular'),
    ('EXP-0004', timestamptz '2026-04-08 11:55:00-06', 'Losartan', '50 mg', 'Una vez al dia', '30 dias', 'Tomar en la manana'),
    ('EXP-0006', timestamptz '2026-04-09 15:40:00-06', 'Salbutamol', '2 disparos', 'Cada 8 horas', '5 dias', 'Usar en caso de dificultad respiratoria')
) as x(expediente_numero, fecha_registro, medicamento_nombre, dosis, frecuencia, duracion, indicaciones)
join pacientes p on p.numero_expediente = x.expediente_numero
join expedientes ex on ex.paciente_id = p.id and ex.fecha_registro = x.fecha_registro
join medicamentos m on m.nombre = x.medicamento_nombre
where not exists (
  select 1
  from recetas r
  where r.expediente_id = ex.id
    and r.medicamento_id = m.id
);

insert into facturas (
  paciente_id,
  cita_id,
  numero_factura,
  monto_total,
  estado,
  fecha_emision
)
select p.id, ci.id, x.numero_factura, x.monto_total, x.estado, x.fecha_emision
from (
  values
    ('EXP-0001', date '2026-04-06', time '08:00', 'FAC-0001', 25000.00, 'pagada', timestamptz '2026-04-06 09:00:00-06'),
    ('EXP-0002', date '2026-04-06', time '09:00', 'FAC-0002', 38000.00, 'pendiente', timestamptz '2026-04-06 09:50:00-06'),
    ('EXP-0003', date '2026-04-07', time '10:00', 'FAC-0003', 22000.00, 'parcial', timestamptz '2026-04-07 11:00:00-06'),
    ('EXP-0004', date '2026-04-08', time '11:00', 'FAC-0004', 41000.00, 'pagada', timestamptz '2026-04-08 12:05:00-06'),
    ('EXP-0005', date '2026-04-08', time '13:00', 'FAC-0005', 18000.00, 'pendiente', timestamptz '2026-04-08 13:40:00-06'),
    ('EXP-0006', date '2026-04-09', time '15:00', 'FAC-0006', 27000.00, 'parcial', timestamptz '2026-04-09 16:00:00-06')
) as x(expediente_numero, fecha, hora_inicio, numero_factura, monto_total, estado, fecha_emision)
join pacientes p on p.numero_expediente = x.expediente_numero
join citas ci on ci.paciente_id = p.id and ci.fecha = x.fecha and ci.hora_inicio = x.hora_inicio
on conflict (numero_factura) do update
set monto_total = excluded.monto_total,
    estado = excluded.estado,
    fecha_emision = excluded.fecha_emision;

insert into pagos (factura_id, metodo_pago, monto, referencia, fecha_pago)
select f.id, x.metodo_pago, x.monto, x.referencia, x.fecha_pago
from (
  values
    ('FAC-0001', 'tarjeta', 25000.00, 'POS-1001', timestamptz '2026-04-06 09:05:00-06'),
    ('FAC-0003', 'sinpe', 10000.00, 'SINPE-2001', timestamptz '2026-04-07 11:10:00-06'),
    ('FAC-0004', 'transferencia', 41000.00, 'TRF-3001', timestamptz '2026-04-08 12:10:00-06'),
    ('FAC-0006', 'efectivo', 12000.00, 'CAJA-4001', timestamptz '2026-04-09 16:05:00-06')
) as x(numero_factura, metodo_pago, monto, referencia, fecha_pago)
join facturas f on f.numero_factura = x.numero_factura
where not exists (
  select 1
  from pagos p
  where p.factura_id = f.id
    and p.referencia = x.referencia
);

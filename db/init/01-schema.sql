create extension if not exists "pgcrypto";

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(50) not null unique,
  descripcion text,
  created_at timestamptz not null default now()
);

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  rol_id uuid not null references roles(id),
  nombre varchar(120) not null,
  apellido_1 varchar(120) not null,
  apellido_2 varchar(120),
  email varchar(180) not null unique,
  password_hash text not null,
  telefono varchar(30),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists especialidades (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(120) not null unique,
  descripcion text,
  created_at timestamptz not null default now()
);

create table if not exists consultorios (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(100) not null,
  ubicacion varchar(160),
  piso varchar(30),
  estado varchar(30) not null default 'disponible',
  created_at timestamptz not null default now()
);

create table if not exists doctores (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null unique references usuarios(id),
  especialidad_id uuid not null references especialidades(id),
  codigo_colegiado varchar(60) not null unique,
  fecha_contratacion date,
  created_at timestamptz not null default now()
);

create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  numero_expediente varchar(40) not null unique,
  nombre varchar(120) not null,
  apellido_1 varchar(120) not null,
  apellido_2 varchar(120),
  fecha_nacimiento date not null,
  genero varchar(30),
  telefono varchar(30),
  email varchar(180),
  direccion text,
  contacto_emergencia_nombre varchar(160),
  contacto_emergencia_telefono varchar(30),
  created_at timestamptz not null default now()
);

create table if not exists citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id),
  doctor_id uuid not null references doctores(id),
  consultorio_id uuid references consultorios(id),
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado varchar(30) not null default 'programada',
  motivo text,
  observaciones text,
  created_at timestamptz not null default now(),
  constraint citas_horario_valido check (hora_fin > hora_inicio)
);

create table if not exists expedientes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id),
  cita_id uuid references citas(id),
  doctor_id uuid not null references doctores(id),
  diagnostico text not null,
  sintomas text,
  tratamiento text,
  notas text,
  fecha_registro timestamptz not null default now()
);

create table if not exists medicamentos (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(140) not null unique,
  presentacion varchar(80),
  descripcion text,
  created_at timestamptz not null default now()
);

create table if not exists recetas (
  id uuid primary key default gen_random_uuid(),
  expediente_id uuid not null references expedientes(id),
  medicamento_id uuid not null references medicamentos(id),
  dosis varchar(80) not null,
  frecuencia varchar(80) not null,
  duracion varchar(80) not null,
  indicaciones text,
  created_at timestamptz not null default now()
);

create table if not exists facturas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id),
  cita_id uuid references citas(id),
  numero_factura varchar(40) not null unique,
  monto_total numeric(12,2) not null,
  estado varchar(30) not null default 'pendiente',
  fecha_emision timestamptz not null default now()
);

create table if not exists pagos (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null references facturas(id),
  metodo_pago varchar(40) not null,
  monto numeric(12,2) not null,
  referencia varchar(80),
  fecha_pago timestamptz not null default now(),
  constraint pagos_monto_positivo check (monto > 0)
);

insert into roles (nombre, descripcion)
values
  ('admin', 'Administrador general del sistema'),
  ('recepcionista', 'Gestion de citas, pacientes y pagos'),
  ('doctor', 'Acceso clinico a expedientes y consultas')
on conflict (nombre) do nothing;

create index if not exists idx_usuarios_rol_id on usuarios(rol_id);
create index if not exists idx_doctores_especialidad_id on doctores(especialidad_id);
create index if not exists idx_citas_paciente_id on citas(paciente_id);
create index if not exists idx_citas_doctor_id on citas(doctor_id);
create index if not exists idx_citas_fecha on citas(fecha);
create index if not exists idx_expedientes_paciente_id on expedientes(paciente_id);
create index if not exists idx_expedientes_doctor_id on expedientes(doctor_id);
create index if not exists idx_facturas_paciente_id on facturas(paciente_id);
create index if not exists idx_pagos_factura_id on pagos(factura_id);

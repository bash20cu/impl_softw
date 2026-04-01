create extension if not exists "pgcrypto";

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(50) not null unique,
  descripcion text,
  created_at timestamptz not null default now()
);

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  rol_id uuid not null,
  nombre varchar(120) not null,
  apellido_1 varchar(120) not null,
  apellido_2 varchar(120),
  email varchar(180) not null unique,
  password_hash text not null,
  telefono varchar(30),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint fk_usuarios_roles
    foreign key (rol_id) references roles(id)
    on update cascade
    on delete restrict
);

create table if not exists especialidades (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(120) not null unique,
  descripcion text,
  created_at timestamptz not null default now()
);

create table if not exists consultorios (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(100) not null unique,
  ubicacion varchar(160),
  piso varchar(30),
  estado varchar(30) not null default 'disponible',
  created_at timestamptz not null default now(),
  constraint chk_consultorios_estado
    check (estado in ('disponible', 'ocupado', 'mantenimiento'))
);

create table if not exists doctores (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null unique,
  especialidad_id uuid not null,
  codigo_colegiado varchar(60) not null unique,
  fecha_contratacion date,
  created_at timestamptz not null default now(),
  constraint fk_doctores_usuarios
    foreign key (usuario_id) references usuarios(id)
    on update cascade
    on delete restrict,
  constraint fk_doctores_especialidades
    foreign key (especialidad_id) references especialidades(id)
    on update cascade
    on delete restrict
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
  created_at timestamptz not null default now(),
  constraint chk_pacientes_genero
    check (
      genero is null
      or genero in ('femenino', 'masculino', 'otro', 'prefiero_no_indicar')
    )
);

create table if not exists citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null,
  doctor_id uuid not null,
  consultorio_id uuid,
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado varchar(30) not null default 'programada',
  motivo text,
  observaciones text,
  created_at timestamptz not null default now(),
  constraint fk_citas_pacientes
    foreign key (paciente_id) references pacientes(id)
    on update cascade
    on delete restrict,
  constraint fk_citas_doctores
    foreign key (doctor_id) references doctores(id)
    on update cascade
    on delete restrict,
  constraint fk_citas_consultorios
    foreign key (consultorio_id) references consultorios(id)
    on update cascade
    on delete set null,
  constraint chk_citas_horario_valido
    check (hora_fin > hora_inicio),
  constraint chk_citas_estado
    check (estado in ('programada', 'confirmada', 'atendida', 'cancelada', 'ausente'))
);

create table if not exists expedientes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null,
  cita_id uuid,
  doctor_id uuid not null,
  diagnostico text not null,
  sintomas text,
  tratamiento text,
  notas text,
  fecha_registro timestamptz not null default now(),
  constraint fk_expedientes_pacientes
    foreign key (paciente_id) references pacientes(id)
    on update cascade
    on delete restrict,
  constraint fk_expedientes_citas
    foreign key (cita_id) references citas(id)
    on update cascade
    on delete set null,
  constraint fk_expedientes_doctores
    foreign key (doctor_id) references doctores(id)
    on update cascade
    on delete restrict
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
  expediente_id uuid not null,
  medicamento_id uuid not null,
  dosis varchar(80) not null,
  frecuencia varchar(80) not null,
  duracion varchar(80) not null,
  indicaciones text,
  created_at timestamptz not null default now(),
  constraint fk_recetas_expedientes
    foreign key (expediente_id) references expedientes(id)
    on update cascade
    on delete cascade,
  constraint fk_recetas_medicamentos
    foreign key (medicamento_id) references medicamentos(id)
    on update cascade
    on delete restrict
);

create table if not exists facturas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null,
  cita_id uuid,
  numero_factura varchar(40) not null unique,
  monto_total numeric(12,2) not null,
  estado varchar(30) not null default 'pendiente',
  fecha_emision timestamptz not null default now(),
  constraint fk_facturas_pacientes
    foreign key (paciente_id) references pacientes(id)
    on update cascade
    on delete restrict,
  constraint fk_facturas_citas
    foreign key (cita_id) references citas(id)
    on update cascade
    on delete set null,
  constraint chk_facturas_estado
    check (estado in ('pendiente', 'pagada', 'anulada', 'parcial')),
  constraint chk_facturas_monto_total
    check (monto_total > 0)
);

create table if not exists pagos (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null,
  metodo_pago varchar(40) not null,
  monto numeric(12,2) not null,
  referencia varchar(80),
  fecha_pago timestamptz not null default now(),
  constraint fk_pagos_facturas
    foreign key (factura_id) references facturas(id)
    on update cascade
    on delete restrict,
  constraint chk_pagos_metodo
    check (metodo_pago in ('efectivo', 'tarjeta', 'transferencia', 'sinpe')),
  constraint chk_pagos_monto_positivo
    check (monto > 0)
);

create index if not exists idx_usuarios_rol_id on usuarios(rol_id);
create index if not exists idx_doctores_usuario_id on doctores(usuario_id);
create index if not exists idx_doctores_especialidad_id on doctores(especialidad_id);
create index if not exists idx_citas_paciente_id on citas(paciente_id);
create index if not exists idx_citas_doctor_id on citas(doctor_id);
create index if not exists idx_citas_consultorio_id on citas(consultorio_id);
create index if not exists idx_citas_fecha on citas(fecha);
create index if not exists idx_expedientes_paciente_id on expedientes(paciente_id);
create index if not exists idx_expedientes_cita_id on expedientes(cita_id);
create index if not exists idx_expedientes_doctor_id on expedientes(doctor_id);
create index if not exists idx_recetas_expediente_id on recetas(expediente_id);
create index if not exists idx_facturas_paciente_id on facturas(paciente_id);
create index if not exists idx_facturas_cita_id on facturas(cita_id);
create index if not exists idx_pagos_factura_id on pagos(factura_id);

-- Reporte 1
-- Citas por doctor y rango de fechas
--
-- Parametros esperados:
--   :fecha_inicio  -> date
--   :fecha_fin     -> date
--   :codigo_doctor -> varchar opcional

select
  c.fecha,
  c.hora_inicio,
  c.hora_fin,
  c.estado,
  concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
  concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor,
  e.nombre as especialidad,
  co.nombre as consultorio,
  c.motivo
from citas c
join pacientes p on p.id = c.paciente_id
join doctores d on d.id = c.doctor_id
join usuarios u on u.id = d.usuario_id
join especialidades e on e.id = d.especialidad_id
left join consultorios co on co.id = c.consultorio_id
where c.fecha between :fecha_inicio and :fecha_fin
  and (:codigo_doctor is null or d.codigo_colegiado = :codigo_doctor)
order by c.fecha, c.hora_inicio, doctor, paciente;


-- Reporte 2
-- Pacientes atendidos y pagos registrados por periodo
--
-- Parametros esperados:
--   :fecha_inicio -> date
--   :fecha_fin    -> date

select
  p.numero_expediente,
  concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
  count(distinct ex.id) as consultas_atendidas,
  count(distinct f.id) as facturas_emitidas,
  coalesce(sum(pg.monto), 0)::numeric(12,2) as total_pagado,
  min(ex.fecha_registro)::date as primera_atencion_periodo,
  max(ex.fecha_registro)::date as ultima_atencion_periodo
from pacientes p
left join expedientes ex
  on ex.paciente_id = p.id
  and ex.fecha_registro::date between :fecha_inicio and :fecha_fin
left join facturas f
  on f.paciente_id = p.id
  and f.fecha_emision::date between :fecha_inicio and :fecha_fin
left join pagos pg
  on pg.factura_id = f.id
  and pg.fecha_pago::date between :fecha_inicio and :fecha_fin
group by p.id, p.numero_expediente, p.nombre, p.apellido_1, p.apellido_2
having count(distinct ex.id) > 0 or count(distinct f.id) > 0 or coalesce(sum(pg.monto), 0) > 0
order by total_pagado desc, consultas_atendidas desc, paciente asc;


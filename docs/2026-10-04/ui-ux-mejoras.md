# UI/UX - Mejoras visuales ClinicaPlus

## Objetivo

Hacer que la aplicacion se sienta menos generica, mas consistente y mas cercana a una interfaz administrativa estilo Microsoft Fluent: superficies limpias, bordes suaves pero no exagerados, jerarquia clara y menos decoracion innecesaria.

## Diagnostico rapido

- Las tarjetas estaban demasiado redondeadas (`rounded-[2rem]`, `rounded-[1.7rem]`, `rounded-full`) y eso hacia que la interfaz pareciera mas una landing generica que un sistema clinico.
- Varias paginas repetian la misma estructura de hero grande, tarjetas y sombras pesadas, aunque son pantallas operativas.
- El texto de estado del proyecto seguia diciendo "Siguiente paso del equipo" con tareas ya completadas: login, pacientes y datos demo.
- Las sombras eran fuertes para un backoffice; conviene bajar el relieve y dejar que el orden visual venga de espacio, borde y tipografia.
- La navegacion superior tenia buena intencion por secciones, pero necesitaba radios mas moderados y menos apariencia de burbuja.

## Cambios aplicados hoy

- Se redujo el radio global del sistema visual para que shadcn y las clases derivadas se vean mas sobrias.
- Se agregaron clases reutilizables: `page-frame`, `page-stack`, `hero-panel`, `panel-card`, `list-card`, `metric-card`, `page-eyebrow`, `page-title`, `page-subtitle` e `info-pill`.
- Se bajo el peso de sombras y bordes en dashboard, inicio, pacientes, citas, facturas, reportes y administracion de usuarios.
- Se cambio el texto viejo de "Siguiente paso" por un estado real del producto: login, pacientes y datos demo ya estan listos.
- Se ajusto el header para que el menu superior tenga radios mas moderados y transiciones mas controladas.

## Prioridades siguientes

1. Normalizar formularios: botones de guardar, mensajes de error y contenedores todavia usan radios grandes en varios componentes.
2. Crear una pagina base reutilizable para CRUDs: titulo, contador, CTA principal, lista y estado vacio.
3. Convertir los listados largos en tablas o listas densas segun el caso: pacientes puede ser lista, facturas y citas se benefician de tabla compacta.
4. Revisar los detalles de entidad: paciente, cita, doctor, expediente y factura deben compartir el mismo patron visual.
5. Mejorar estados vacios, errores y permisos con mensajes accionables en vez de bloques decorativos.
6. Alinear todos los textos a lenguaje operativo: menos "esta pagina deja resuelta" y mas "Filtra", "Consulta", "Registra", "Actualiza".
7. Revisar responsivo en mobile: el header actual funciona, pero los listados necesitan mejor densidad y orden.

## Regla visual acordada

- Usar `rounded-lg` para botones y controles.
- Usar `list-card` para filas/listados.
- Usar `hero-panel` solo cuando la pantalla necesita contexto fuerte; no abusarlo en formularios simples.
- Evitar `rounded-full` salvo badges pequenos o indicadores puntuales.
- Evitar sombras grandes; preferir borde fino, fondo blanco y jerarquia por espaciado.

async function crearLinea() {
  const data = {
    nombre: document.getElementById('lineaNombre').value,
    siembra_inicial: document.getElementById('siembraInicial').value || null,
    siembra_final: document.getElementById('siembraFinal').value || null,
  };
  await fetch('/lineas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Línea creada');
}

async function crearSemilla() {
  const data = {
    nombre: document.getElementById('semillaNombre').value,
    origen: document.getElementById('semillaOrigen').value || null,
    fecha_alta: document.getElementById('semillaFecha').value || null,
  };
  await fetch('/semillas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Semilla creada');
}

async function crearCompra() {
  const data = {
    semilla_id: Number(document.getElementById('compraSemillaId').value),
    fecha: document.getElementById('compraFecha').value,
    proveedor: document.getElementById('compraProveedor').value || null,
    cantidad: Number(document.getElementById('compraCantidad').value),
    costo: Number(document.getElementById('compraCosto').value),
  };
  await fetch('/compras-semilla', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Compra registrada');
}

async function asignarSemilla() {
  const lineaId = Number(document.getElementById('asigLineaId').value);
  const data = {
    semilla_id: Number(document.getElementById('asigSemillaId').value),
    fecha: document.getElementById('asigFecha').value,
    cantidad: Number(document.getElementById('asigCantidad').value),
  };
  await fetch(`/lineas/${lineaId}/asignar-semilla`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Semilla asignada a la línea');
}

async function registrarCosecha() {
  const data = {
    linea_id: Number(document.getElementById('cosechaLineaId').value),
    fecha: document.getElementById('cosechaFecha').value,
    unidades_kilos: Number(document.getElementById('cosechaUnidades').value),
  };
  await fetch('/cosechas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Cosecha registrada');
}

async function registrarVenta() {
  const data = {
    fecha: document.getElementById('ventaFecha').value,
    planta: document.getElementById('ventaPlanta').value,
    linea_id: Number(document.getElementById('ventaLineaId').value),
    cantidad: Number(document.getElementById('ventaCantidad').value),
    precio_unitario: Number(document.getElementById('ventaPrecio').value),
    descuento: Number(document.getElementById('ventaDescuento').value) || 0,
    motivo_descuento: document.getElementById('ventaMotivo').value || null,
    pago_total: null,
  };
  await fetch('/ventas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Venta registrada');
}

async function registrarMedida() {
  const data = {
    linea_id: Number(document.getElementById('medLineaId').value),
    fecha: document.getElementById('medFecha').value,
    medida: Number(document.getElementById('medMedida').value),
    notas: document.getElementById('medNotas').value || null,
  };
  await fetch('/medidas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Medida registrada');
}

async function guardarRazonComparativo() {
  const data = {
    linea_id: Number(document.getElementById('compLineaId').value),
    anio: Number(document.getElementById('compHasta').value),
    razon_mejora: document.getElementById('compRazon').value || null,
    notas: null,
  };
  await fetch('/comparativo-nota', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  alert('Razón de mejora guardada');
}

async function verComparativo() {
  const desde = Number(document.getElementById('compDesde').value);
  const hasta = Number(document.getElementById('compHasta').value);
  const res = await fetch(`/reportes/comparativo?anio_desde=${desde}&anio_hasta=${hasta}`);
  const json = await res.json();
  alert(JSON.stringify(json, null, 2));
}

async function verVentasPorLinea() {
  const lineaId = Number(document.getElementById('repLineaId').value);
  const desde = document.getElementById('repDesde').value;
  const hasta = document.getElementById('repHasta').value;
  const q = [];
  if (desde) q.push(`desde=${encodeURIComponent(desde)}`);
  if (hasta) q.push(`hasta=${encodeURIComponent(hasta)}`);
  const qs = q.length ? `?${q.join('&')}` : '';
  const res = await fetch(`/reportes/ventas-por-linea/${lineaId}${qs}`);
  const json = await res.json();
  document.getElementById('repVentas').textContent = JSON.stringify(json, null, 2);
  // Actualiza link CSV
  document.getElementById('repVentasCSV').href = `/export/ventas-por-linea/${lineaId}.csv${qs}`;
}

async function verSiembraCosecha() {
  const lineaId = Number(document.getElementById('repSCLineaId').value);
  const res = await fetch(`/reportes/siembra-cosecha/${lineaId}`);
  const json = await res.json();
  document.getElementById('repSiembraCosecha').textContent = JSON.stringify(json, null, 2);
  // Actualiza link CSV
  document.getElementById('repSCCSV').href = `/export/siembra-cosecha/${lineaId}.csv`;
}

let compChartInstance = null;
async function verComparativo() {
  const desde = Number(document.getElementById('compDesde').value);
  const hasta = Number(document.getElementById('compHasta').value);
  const lineaId = Number(document.getElementById('compLineaId').value);
  const res = await fetch(`/reportes/comparativo?anio_desde=${desde}&anio_hasta=${hasta}`);
  const datos = await res.json();
  const item = datos.find(d => d.linea_id === lineaId);
  if (!item) { alert('No hay datos para esa línea'); return; }

  const ctx = document.getElementById('compChart');
  const data = {
    labels: [String(desde), String(hasta)],
    datasets: [{
      label: `Unidades/Kilos - ${item.nombre}`,
      data: [item.unidades_desde, item.unidades_hasta],
      backgroundColor: ['#4e79a7', '#59a14f']
    }]
  };
  if (compChartInstance) compChartInstance.destroy();
  compChartInstance = new Chart(ctx, { type: 'bar', data });

  // Actualiza link Excel
  document.getElementById('compExcel').href = `/export/comparativo.xlsx?anio_desde=${desde}&anio_hasta=${hasta}`;
}

async function verResumenVentas() {
  const lineaId = Number(document.getElementById('repLineaId').value);
  const desde = document.getElementById('repDesde').value;
  const hasta = document.getElementById('repHasta').value;
  if (!desde || !hasta) { alert('Completa fechas desde y hasta'); return; }
  const res = await fetch(`/reportes/ventas-resumen?linea_id=${lineaId}&desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`);
  const json = await res.json();
  document.getElementById('repVentasResumen').textContent = JSON.stringify(json, null, 2);
}

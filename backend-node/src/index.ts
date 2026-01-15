import express from 'express'
import cors from 'cors'
import { db, loadDB, linea, semilla, compra_semilla, linea_semilla_asignacion, cosecha, venta, medida_crecimiento, comparativo_nota } from './db'
import ExcelJS from 'exceljs'

const app = express()
app.use(cors())
app.use(express.json())

// Inyección de información
app.post('/lineas', (req, res) => {
  const { nombre, siembra_inicial, siembra_final } = req.body
  const doc = linea.insert({ nombre, siembra_inicial: siembra_inicial ?? null, siembra_final: siembra_final ?? null })
  res.json({ id: doc.$loki, ...doc })
})

app.get('/lineas', (_req, res) => {
  const rows = linea.find().map(d => ({ id: d.$loki, ...d }))
  res.json(rows)
})

app.post('/semillas', (req, res) => {
  const { nombre, origen, fecha_alta } = req.body
  const doc = semilla.insert({ nombre, origen: origen ?? null, fecha_alta: fecha_alta ?? null })
  res.json({ id: doc.$loki, ...doc })
})

app.get('/semillas', (_req, res) => {
  const rows = semilla.find().map(d => ({ id: d.$loki, ...d }))
  res.json(rows)
})

app.post('/compras-semilla', (req, res) => {
  const { semilla_id, fecha, proveedor, cantidad, costo } = req.body
  const semDoc = semilla.findOne({ $loki: semilla_id })
  if (!semDoc) return res.status(404).json({ detail: 'Semilla no encontrada' })
  const doc = compra_semilla.insert({ semilla_id, fecha, proveedor: proveedor ?? null, cantidad: cantidad ?? 0, costo: costo ?? 0 })
  res.json({ id: doc.$loki, ...doc })
})

app.post('/lineas/:linea_id/asignar-semilla', (req, res) => {
  const linea_id = Number(req.params.linea_id)
  const { semilla_id, fecha, cantidad } = req.body
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const semDoc = semilla.findOne({ $loki: semilla_id })
  if (!semDoc) return res.status(404).json({ detail: 'Semilla no encontrada' })
  const doc = linea_semilla_asignacion.insert({ linea_id, semilla_id, fecha, cantidad: cantidad ?? 0 })
  res.json({ id: doc.$loki, ...doc })
})

app.post('/cosechas', (req, res) => {
  const { linea_id, fecha, unidades_kilos } = req.body
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const doc = cosecha.insert({ linea_id, fecha, unidades_kilos })
  res.json({ id: doc.$loki, ...doc })
})

app.post('/ventas', (req, res) => {
  const { fecha, planta, linea_id, cantidad, precio_unitario, descuento, motivo_descuento, pago_total } = req.body
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const total = pago_total ?? (cantidad * precio_unitario - (descuento ?? 0))
  const doc = venta.insert({ fecha, planta, linea_id, cantidad, precio_unitario, descuento: descuento ?? 0, motivo_descuento: motivo_descuento ?? null, pago_total: total })
  res.json({ id: doc.$loki, ...doc })
})

app.post('/medidas', (req, res) => {
  const { linea_id, fecha, medida, notas } = req.body
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const doc = medida_crecimiento.insert({ linea_id, fecha, medida, notas: notas ?? null })
  res.json({ id: doc.$loki, ...doc })
})

app.post('/comparativo-nota', (req, res) => {
  const { linea_id, anio, razon_mejora, notas } = req.body
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const doc = comparativo_nota.insert({ linea_id, anio, razon_mejora: razon_mejora ?? null, notas: notas ?? null })
  res.json({ id: doc.$loki, ...doc })
})

// Reportes
app.get('/reportes/ventas-por-linea/:linea_id', (req, res) => {
  const linea_id = Number(req.params.linea_id)
  const { desde, hasta } = req.query as { desde?: string; hasta?: string }
  let ventasList = venta.find({ linea_id }).map(v => ({ ...v, id: (v as any).$loki }))
  if (desde) ventasList = ventasList.filter(v => String(v.fecha) >= desde)
  if (hasta) ventasList = ventasList.filter(v => String(v.fecha) <= hasta)
  const out = ventasList.map(v => ({
    venta_id: v.id,
    fecha: v.fecha,
    planta: v.planta,
    cantidad: v.cantidad,
    precio_unitario: v.precio_unitario,
    descuento: v.descuento,
    motivo_descuento: v.motivo_descuento,
    pago_total: v.pago_total,
  }))
  res.json(out)
})

app.get('/export/ventas-por-linea/:linea_id.csv', (req, res) => {
  const linea_id = Number(req.params.linea_id)
  const { desde, hasta } = req.query as { desde?: string; hasta?: string }
  let ventasList = venta.find({ linea_id })
  if (desde) ventasList = ventasList.filter(v => String(v.fecha) >= desde)
  if (hasta) ventasList = ventasList.filter(v => String(v.fecha) <= hasta)
  const header = 'venta_id,fecha,planta,cantidad,precio_unitario,descuento,motivo_descuento,pago_total\n'
  const rows = ventasList.map((v: any) => [v.$loki, v.fecha, v.planta, v.cantidad, v.precio_unitario, v.descuento, v.motivo_descuento ?? '', v.pago_total].join(',')).join('\\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=ventas_linea_${linea_id}.csv`)
  res.send(header + rows)
})

app.get('/reportes/siembra-cosecha/:linea_id', (req, res) => {
  const linea_id = Number(req.params.linea_id)
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const cosechasList = cosecha.find({ linea_id })
  const total_kilos = cosechasList.reduce((s: number, c: any) => s + (c.unidades_kilos ?? 0), 0)
  res.json({
    linea_id: linea_id,
    nombre: linDoc.nombre,
    siembra_inicial: linDoc.siembra_inicial,
    siembra_final: linDoc.siembra_final,
    cosechas: cosechasList.map((c: any) => ({ fecha: c.fecha, unidades_kilos: c.unidades_kilos })),
    total_kilos,
  })
})

app.get('/export/siembra-cosecha/:linea_id.csv', (req, res) => {
  const linea_id = Number(req.params.linea_id)
  const linDoc = linea.findOne({ $loki: linea_id })
  if (!linDoc) return res.status(404).json({ detail: 'Línea no encontrada' })
  const cosechasList = cosecha.find({ linea_id })
  const header = 'linea_id,nombre,siembra_inicial,siembra_final,fecha_cosecha,unidades_kilos\n'
  const rows = cosechasList.length === 0
    ? `${linea_id},${linDoc.nombre},${linDoc.siembra_inicial ?? ''},${linDoc.siembra_final ?? ''},,`
    : cosechasList.map((c: any) => [linea_id, linDoc.nombre, linDoc.siembra_inicial ?? '', linDoc.siembra_final ?? '', c.fecha, c.unidades_kilos].join(',')).join('\\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=siembra_cosecha_linea_${linea_id}.csv`)
  res.send(header + rows)
})

app.get('/reportes/comparativo', (req, res) => {
  const anio_desde = Number((req.query as any).anio_desde)
  const anio_hasta = Number((req.query as any).anio_hasta)
  const cosechasList = cosecha.find().map((c: any) => ({ linea_id: c.linea_id, fecha: c.fecha, unidades_kilos: c.unidades_kilos }))
  const porAnioLinea = new Map<string, number>()
  for (const c of cosechasList) {
    const anio = Number(String(c.fecha).slice(0, 4))
    const key = `${c.linea_id}-${anio}`
    porAnioLinea.set(key, (porAnioLinea.get(key) ?? 0) + c.unidades_kilos)
  }
  const lineasList = linea.find()
  const notasList = comparativo_nota.find({ anio: anio_hasta })
  const razonPorLinea = new Map<number, string | null>()
  for (const n of notasList) razonPorLinea.set((n as any).linea_id, (n as any).razon_mejora ?? null)
  const resultado = lineasList.map(l => {
    const u_desde = porAnioLinea.get(`${l.id}-${anio_desde}`) ?? 0
    const u_hasta = porAnioLinea.get(`${l.id}-${anio_hasta}`) ?? 0
    const cambio = u_hasta - u_desde
    const mejoro = cambio > 0
    return {
      linea_id: (l as any).$loki,
      nombre: (l as any).nombre,
      anio_desde,
      anio_hasta,
      unidades_desde: u_desde,
      unidades_hasta: u_hasta,
      cambio,
      mejoro,
      razon_mejora: razonPorLinea.get((l as any).$loki) ?? null,
    }
  })
  res.json(resultado)
})

app.get('/export/comparativo.xlsx', async (req, res) => {
  const anio_desde = Number((req.query as any).anio_desde)
  const anio_hasta = Number((req.query as any).anio_hasta)
  const datos = await (await fetch(`http://localhost:3000/reportes/comparativo?anio_desde=${anio_desde}&anio_hasta=${anio_hasta}`)).json()
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Comparativo')
  ws.addRow(['linea_id', 'nombre', 'anio_desde', 'anio_hasta', 'unidades_desde', 'unidades_hasta', 'cambio', 'mejoro', 'razon_mejora'])
  for (const d of datos) {
    ws.addRow([d.linea_id, d.nombre, d.anio_desde, d.anio_hasta, d.unidades_desde, d.unidades_hasta, d.cambio, d.mejoro, d.razon_mejora ?? ''])
  }
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=comparativo_${anio_desde}_${anio_hasta}.xlsx`)
  await wb.xlsx.write(res)
  res.end()
})

const PORT = 3050
loadDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Node API escuchando en http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Error cargando la BD:', err)
    process.exit(1)
  })

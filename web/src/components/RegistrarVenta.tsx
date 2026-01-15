import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function RegistrarVenta() {
  const [lineaId, setLineaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [comprador, setComprador] = useState('')
  const [kilos, setKilos] = useState('')
  const [precioKilo, setPrecioKilo] = useState('')
  const [descuentos, setDescuentos] = useState('')
  const [msg, setMsg] = useState('')
  const [total, setTotal] = useState(0)

  // Calculate total automatically
  useEffect(() => {
    const k = Number(kilos) || 0
    const p = Number(precioKilo) || 0
    const d = Number(descuentos) || 0
    setTotal((k * p) - d)
  }, [kilos, precioKilo, descuentos])

  async function guardar() {
    try {
      const body = {
        linea_id: Number(lineaId),
        fecha,
        comprador, // New field
        kilos: Number(kilos),
        precio_por_kilo: Number(precioKilo), // New field
        descuentos: Number(descuentos), // New field
        total_final: total // New field
      }
      // Note: Backend endpoint might need update to accept these new fields
      const res = await api.post('/ventas', body)
      setMsg(`Venta registrada exitosamente. ID: ${JSON.stringify(res)}`)
      // Reset form
      setLineaId('')
      setComprador('')
      setKilos('')
      setPrecioKilo('')
      setDescuentos('')
      setTotal(0)
    } catch (e) {
      console.error(e)
      setMsg('Error al registrar venta. Asegúrese que el backend soporte estos datos.')
    }
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lineaIdVenta">Línea de Origen (ID)</Label>
            <Input id="lineaIdVenta" value={lineaId} onChange={e => setLineaId(e.target.value)} placeholder="Ej: 20" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="fechaVenta">Fecha de Venta</Label>
            <Input id="fechaVenta" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comprador">Empresa / Planta Compradora</Label>
            <Input id="comprador" value={comprador} onChange={e => setComprador(e.target.value)} placeholder="Ej: Planta San José" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="kilos">Kilos Brutos</Label>
                <Input id="kilos" type="number" value={kilos} onChange={e => setKilos(e.target.value)} placeholder="0" />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="precio">Precio por Kilo ($)</Label>
                <Input id="precio" type="number" value={precioKilo} onChange={e => setPrecioKilo(e.target.value)} placeholder="Ej: 1500" />
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descuentos">Descuentos Totales ($)</Label>
            <Input id="descuentos" type="number" value={descuentos} onChange={e => setDescuentos(e.target.value)} placeholder="Mermas, Calibre, etc." />
            <p className="text-xs text-muted-foreground">Suma de todos los descuentos (mermas, bajos calibres).</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
             <span className="font-semibold text-sm">Total a Pagar</span>
             <span className="font-bold text-xl text-primary">$ {total.toLocaleString('es-CL')}</span>
          </div>

          <Button onClick={guardar} className="w-full text-lg h-12">Registrar Venta</Button>
          {msg && <p className="text-sm text-center text-muted-foreground mt-2">{msg}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

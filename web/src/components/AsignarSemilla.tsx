import React, { useState } from 'react'
import { api } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function AsignarSemilla() {
  const [lineaId, setLineaId] = useState('')
  const [semillaId, setSemillaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [msg, setMsg] = useState('')

  async function asignar() {
    try {
      const body = {
        semilla_id: Number(semillaId),
        fecha,
        cantidad: Number(cantidad || '0'),
      }
      const res = await api.post(`/lineas/${Number(lineaId)}/asignar-semilla`, body)
      setMsg(`Asignación creada exitosamente`)
      setLineaId('')
      setSemillaId('')
      setFecha('')
      setCantidad('')
    } catch (e) {
      setMsg('Error al asignar')
      console.error(e)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar Semilla a Línea</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lineaIdAsignar">Línea ID</Label>
            <Input id="lineaIdAsignar" value={lineaId} onChange={e => setLineaId(e.target.value)} placeholder="ID de la línea" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="semillaId">Semilla ID</Label>
            <Input id="semillaId" value={semillaId} onChange={e => setSemillaId(e.target.value)} placeholder="ID de la semilla" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaAsignar">Fecha</Label>
            <Input id="fechaAsignar" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input id="cantidad" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="0" />
          </div>
          <Button onClick={asignar} className="w-full">Asignar</Button>
          {msg && <p className="text-sm text-center text-muted-foreground mt-2">{msg}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

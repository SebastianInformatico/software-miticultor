import React, { useState } from 'react'
import { api } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function CreateSemilla() {
  const [proveedor, setProveedor] = useState('')
  const [tipo, setTipo] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [msg, setMsg] = useState('')

  async function guardar() {
    try {
      // Mapping to Backend Entity: Semilla
      const body = {
        proveedor,
        tipo: tipo || 'Captación Natural',
        fechaIngreso: fechaIngreso || new Date().toISOString().split('T')[0],
        cantidadInicial: Number(cantidad)
      }
      
      const res = await api.post('/semillas', body)
      setMsg(`Semilla registrada con éxito (ID: ${res.id})`)
      setProveedor('')
      setTipo('')
      setCantidad('')
      setFechaIngreso('')
    } catch (e) {
      setMsg('Error al guardar semilla')
      console.error(e)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Input id="proveedor" value={proveedor} onChange={e => setProveedor(e.target.value)} placeholder="Ej: Semillas del Sur Ltda." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo de Semilla</Label>
            <Input id="tipo" value={tipo} onChange={e => setTipo(e.target.value)} placeholder="Ej: Mytilus Chilensis" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cantidad">Cantidad Inicial (Unidades)</Label>
            <Input id="cantidad" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Ej: 10000" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
            <Input id="fechaIngreso" type="date" value={fechaIngreso} onChange={e => setFechaIngreso(e.target.value)} />
          </div>
          <Button onClick={guardar} className="w-full bg-emerald-600 hover:bg-emerald-700">Registrar Semilla</Button>
          {msg && <p className="text-sm text-center text-emerald-600 mt-2 font-medium bg-emerald-50 py-2 rounded">{msg}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

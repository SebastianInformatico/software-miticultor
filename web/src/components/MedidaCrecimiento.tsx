import React, { useState } from 'react'
import { api } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function MedidaCrecimiento() {
  const [lineaId, setLineaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [talla, setTalla] = useState('')
  const [peso, setPeso] = useState('')
  const [msg, setMsg] = useState('')

  async function guardar() {
    try {
      // Mapping to Backend Entity: RegistroCrecimiento
      const body = {
        linea: { id: Number(lineaId) },
        fechaMedicion: fecha || new Date().toISOString().split('T')[0],
        tallaPromedioMm: Number(talla),
        pesoPromedioG: Number(peso || '0'), // Optional in UI but required in entity
      }
      
      const res = await api.post('/registros', body)
      setMsg(`Medida registrada! ID: ${res.id}`)
      setLineaId('')
      setFecha('')
      setTalla('')
      setPeso('')
    } catch (e) {
      setMsg('Error: Verifique el ID de la línea')
      console.error(e)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lineaIdMedida">ID de la Línea</Label>
            <Input id="lineaIdMedida" type="number" value={lineaId} onChange={e => setLineaId(e.target.value)} placeholder="Ej: 1" />
            <p className="text-[10px] text-slate-400">Debe existir una línea con este ID.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaMedida">Fecha de Medición</Label>
            <Input id="fechaMedida" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="medida">Talla Promedio (mm)</Label>
                <Input id="medida" type="number" value={talla} onChange={e => setTalla(e.target.value)} placeholder="Ej: 45.5" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="peso">Peso Promedio (g)</Label>
                <Input id="peso" type="number" value={peso} onChange={e => setPeso(e.target.value)} placeholder="Ej: 12" />
            </div>
          </div>
          <Button onClick={guardar} className="w-full bg-orange-600 hover:bg-orange-700">Registrar Medición</Button>
          {msg && <p className="text-sm text-center text-emerald-600 mt-2 font-medium bg-emerald-50 py-2 rounded">{msg}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

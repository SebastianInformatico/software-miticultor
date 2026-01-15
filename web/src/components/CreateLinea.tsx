import React, { useState } from 'react'
import { api } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function CreateLinea() {
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [fechaSiembra, setFechaSiembra] = useState('')
  const [coordX, setCoordX] = useState('')
  const [coordY, setCoordY] = useState('')
  const [msg, setMsg] = useState('')

  async function guardar() {
    try {
      const body = {
        nombre,
        ubicacion: ubicacion || 'Sector General',
        fechaSiembra: fechaSiembra || new Date().toISOString().split('T')[0],
        estado: 'ACTIVA',
        coordenadaX: Number(coordX || 0),
        coordenadaY: Number(coordY || 0)
      }
      // POST to real Spring Boot endpoint
      const res = await api.post('/lineas', body)
      console.log("Línea creada:", res)
      setMsg(`Línea "${nombre}" creada en [${coordX},${coordY}]`)
      setNombre('')
      setUbicacion('')
      setFechaSiembra('')
      setCoordX('')
      setCoordY('')
    } catch (error) {
      setMsg('Error al guardar línea en base de datos')
      console.error(error)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la Línea</Label>
            <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Línea Norte-01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                 <Label htmlFor="coordX">Posición X (0-9)</Label>
                 <Input id="coordX" type="number" min="0" max="9" value={coordX} onChange={e => setCoordX(e.target.value)} placeholder="0" />
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="coordY">Posición Y (0-9)</Label>
                 <Input id="coordY" type="number" min="0" max="9" value={coordY} onChange={e => setCoordY(e.target.value)} placeholder="0" />
               </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaSiembra">Fecha de Siembra</Label>
            <Input id="fechaSiembra" type="date" value={fechaSiembra} onChange={e => setFechaSiembra(e.target.value)} />
          </div>
          <Button onClick={guardar} className="w-full bg-indigo-600 hover:bg-indigo-700">Guardar en Base de Datos</Button>
          {msg && <p className="text-sm text-center text-emerald-600 mt-2 font-medium bg-emerald-50 py-2 rounded">{msg}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

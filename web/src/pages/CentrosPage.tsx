import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { api } from '../api'
import { MapPin, Warehouse, ArrowRight, Anchor } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Centro {
    id: number
    nombre: string
    ubicacionGeografica: string
    totalLineasCapacidad: number
    lineasActivas: number
    porcentajeOcupacion: number
}

// Simple random gradient generator for visual distinction
const gradients = [
    "from-blue-500 to-cyan-400",
    "from-emerald-500 to-teal-400",
    "from-indigo-500 to-purple-400",
    "from-orange-500 to-amber-400"
]

export default function CentrosPage() {
  const [centros, setCentros] = useState<Centro[]>([])
  const [isOpen, setIsOpen] = useState(false)
  
  // Form State
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')

  const loadCentros = async () => {
    try {
        const res = await api.get<Centro[]>('/centros')
        setCentros(res)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadCentros() }, [])

  const handleCreate = async () => {
    try {
        await api.post('/centros', { nombre, ubicacionGeografica: ubicacion })
        setNombre('')
        setUbicacion('')
        setIsOpen(false)
        loadCentros()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">Mis Centros de Cultivo</h2>
            <p className="text-slate-500">Gestión y administración de concesiones marítimas.</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white">
            <Warehouse className="mr-2 h-4 w-4" /> Nuevo Centro
        </Button>

        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DialogHeader><DialogTitle>Registrar Nuevo Centro</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>Nombre del Centro</Label>
                    <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Centro Bahía Manao" />
                </div>
                <div className="grid gap-2">
                    <Label>Ubicación Geográfica</Label>
                    <Input value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Ej: Sector 4, Estero X" />
                </div>
                <Button onClick={handleCreate}>Guardar Centro</Button>
            </div>
        </Dialog>
      </div>

      {centros.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Warehouse className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900">No hay centros registrados</h3>
              <p className="mt-1 text-sm text-slate-500">Comienza creando tu primer centro de cultivo.</p>
          </div>
      ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {centros.map((centro, i) => (
                <Link to={`/centros/${centro.id}`} key={centro.id} className="group relative block h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl transform transition-transform group-hover:scale-[1.02] group-hover:shadow-xl -z-10"></div>
                    <Card className="h-full border-0 bg-white/60 backdrop-blur-sm overflow-hidden hover:bg-white transition-colors">
                        <div className={`h-2 w-full bg-gradient-to-r ${gradients[i % gradients.length]}`}></div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} text-white shadow-lg`}>
                                    <Anchor className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-mono text-slate-400">ID: {centro.id}</span>
                            </div>
                            <CardTitle className="mt-4 text-xl">{centro.nombre}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {centro.ubicacionGeografica}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Ocupación Actual</span>
                                    <span className={`font-semibold ${centro.porcentajeOcupacion > 90 ? "text-red-600" : "text-slate-700"}`}>
                                        {centro.lineasActivas} / {centro.totalLineasCapacidad} Líneas
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 rounded-full ${
                                                centro.porcentajeOcupacion > 90 ? "bg-red-500" : 
                                                centro.porcentajeOcupacion > 70 ? "bg-amber-500" : "bg-emerald-500"
                                            }`} 
                                            style={{ width: `${centro.porcentajeOcupacion}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-end">
                                         <span className="text-xs font-semibold text-slate-500">{centro.porcentajeOcupacion}% Ocupado</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 group-hover:underline">
                                Ver Detalles <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
          </div>
      )}
    </div>
  )
}

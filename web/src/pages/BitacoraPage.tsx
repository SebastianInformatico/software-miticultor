import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { api } from '../api'
import { Calendar, ClipboardList, Anchor, Droplets, Ship, Skull, HelpCircle, Activity } from 'lucide-react'

// Entity Types
interface Evento {
  id: number
  fecha: string
  tipo: string
  descripcion: string
  centroId: number
  lineaId?: number
}

interface Centro {
    id: number
    nombre: string
}

const EVENT_TYPES = [
    { value: 'SIEMBRA', label: 'Siembra', icon: Anchor, color: 'text-blue-500 bg-blue-100' },
    { value: 'COSECHA', label: 'Cosecha', icon: Ship, color: 'text-emerald-500 bg-emerald-100' },
    { value: 'MANTENCION', label: 'Mantención', icon: Activity, color: 'text-amber-500 bg-amber-100' },
    { value: 'MAREA_ROJA', label: 'Marea Roja', icon: Skull, color: 'text-red-500 bg-red-100' },
    { value: 'OTRO', label: 'Otro Evento', icon: HelpCircle, color: 'text-slate-500 bg-slate-100' }
]

export default function BitacoraPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [centros, setCentros] = useState<Centro[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Form
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [tipo, setTipo] = useState('MANTENCION')
  const [descripcion, setDescripcion] = useState('')
  const [centroId, setCentroId] = useState('')

  const loadData = async () => {
    try {
        const [resEventos, resCentros] = await Promise.all([
            api.get<Evento[]>('/bitacora'),
            api.get<Centro[]>('/centros')
        ])
        setEventos(resEventos)
        setCentros(resCentros)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadData() }, [])

  const handleCreate = async () => {
    if (!centroId) return
    try {
        await api.post('/bitacora', { fecha, tipo, descripcion, centroId: Number(centroId) })
        setFecha(new Date().toISOString().split('T')[0])
        setDescripcion('')
        setIsOpen(false)
        loadData()
    } catch (e) { console.error(e) }
  }

  const getIcon = (type: string) => {
      const found = EVENT_TYPES.find(t => t.value === type)
      const Icon = found?.icon || ClipboardList
      return <Icon className={`h-5 w-5 ${found?.color.split(' ')[0]}`} />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">Bitácora de Operaciones</h2>
            <p className="text-slate-500">Registro histórico de eventos y trazabilidad.</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white">
            <ClipboardList className="mr-2 h-4 w-4" /> Registrar Evento
        </Button>

        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DialogHeader><DialogTitle>Nuevo Registro en Bitácora</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>Fecha del Evento</Label>
                    <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label>Centro de Cultivo</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={centroId} 
                        onChange={e => setCentroId(e.target.value)}
                    >
                        <option value="">Seleccionar Centro...</option>
                        {centros.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label>Tipo de Evento</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {EVENT_TYPES.map(t => (
                            <div 
                                key={t.value}
                                onClick={() => setTipo(t.value)}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${tipo === t.value ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`p-1 rounded ${t.color}`}>{<t.icon className="h-4 w-4" />}</div>
                                <span className="text-xs font-medium">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label>Descripción Detallada</Label>
                    <Input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Ej: Se realizó limpieza de boyas..." />
                </div>
                <Button onClick={handleCreate} disabled={!centroId}>Guardar Registro</Button>
            </div>
        </Dialog>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-10">
          {eventos.length === 0 ? (
              <div className="ml-8 py-10 text-slate-400 italic">No hay registros en la bitácora aún.</div>
          ) : (
              eventos.slice().reverse().map((evento) => (
                  <div key={evento.id} className="relative ml-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[41px] top-0 p-1.5 rounded-full border-4 border-white shadow-sm bg-slate-50`}>
                          {getIcon(evento.tipo)}
                      </div>
                      
                      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${EVENT_TYPES.find(t=>t.value===evento.tipo)?.color}`}>
                                              {EVENT_TYPES.find(t=>t.value===evento.tipo)?.label || evento.tipo}
                                          </span>
                                          <span className="text-xs text-slate-400 flex items-center gap-1">
                                              <Calendar className="h-3 w-3" /> {evento.fecha}
                                          </span>
                                      </div>
                                      <CardTitle className="text-lg font-medium text-slate-900">{evento.descripcion}</CardTitle>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent>
                              <div className="text-sm text-slate-500 font-medium">
                                  Centro: {centros.find(c => c.id === evento.centroId)?.nombre || 'Desconocido'}
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              ))
          )}
      </div>
    </div>
  )
}

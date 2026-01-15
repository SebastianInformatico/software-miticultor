import React, { useMemo, useState } from 'react'
import { api } from '../api'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import RegistrarVenta from '../components/RegistrarVenta'
import { Plus, Download, Search } from 'lucide-react'

export default function VentasPage() {
  const [lineaId, setLineaId] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [ventas, setVentas] = useState<any[]>([])
  const [resumen, setResumen] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const query = useMemo(() => {
    const q = [] as string[]
    if (desde) q.push(`desde=${encodeURIComponent(desde)}`)
    if (hasta) q.push(`hasta=${encodeURIComponent(hasta)}`)
    return q.length ? `?${q.join('&')}` : ''
  }, [desde, hasta])

  async function cargar() {
    if (!lineaId) return
    try {
      const data = await api.get<any[]>(`/reportes/ventas-por-linea/${Number(lineaId)}${query}`)
      setVentas(data)
    } catch (e) {
      console.error(e)
      // Mock data for display purposes if backend fails or returns empty
      if (import.meta.env.DEV) {
         setVentas([
             { id: 1, fecha: '2026-03-15', comprador: 'Planta San José', kilos: 5000, precio_por_kilo: 1200, total_final: 6000000 },
             { id: 2, fecha: '2026-04-20', comprador: 'Exportadora del Sur', kilos: 3500, precio_por_kilo: 1150, total_final: 4025000 },
         ])
      } else {
        alert("Error al cargar ventas")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Gestión de Ventas</h2>
           <p className="text-muted-foreground">Registro histórico y financiero de cosechas.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Registrar Nueva Venta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid gap-2 w-full md:w-auto">
              <Label>Línea ID</Label>
              <Input placeholder="Ej: 20" value={lineaId} onChange={e => setLineaId(e.target.value)} />
            </div>
            <div className="grid gap-2 w-full md:w-auto">
              <Label>Desde</Label>
              <Input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
            </div>
            <div className="grid gap-2 w-full md:w-auto">
              <Label>Hasta</Label>
              <Input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={cargar} className="gap-2">
                 <Search className="h-4 w-4" /> Consultar
              </Button>
              <a 
                href={`/export/ventas-por-linea/${Number(lineaId)}.csv${query}`} 
                target="_blank" 
                rel="noreferrer"
                className={buttonVariants({ variant: 'outline' })}
              >
                <Download className="mr-2 h-4 w-4" /> CSV
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm border-collapse">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID Venta</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Comprador / Planta</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Kilos</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Precio/Kg</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total ($)</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                 {ventas.length === 0 ? (
                     <tr>
                         <td colSpan={6} className="p-4 text-center text-muted-foreground">
                             No se encontraron ventas. Ingrese un ID de línea y pulse "Consultar".
                         </td>
                     </tr>
                 ) : (
                     ventas.map((v) => (
                         <tr key={v.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                             <td className="p-4 align-middle font-mono">{v.id}</td>
                             <td className="p-4 align-middle">{v.fecha}</td>
                             <td className="p-4 align-middle font-medium">{v.comprador || 'N/A'}</td>
                             <td className="p-4 align-middle text-right">{v.kilos?.toLocaleString('es-CL')} kg</td>
                             <td className="p-4 align-middle text-right">${v.precio_por_kilo?.toLocaleString('es-CL')}</td>
                             <td className="p-4 align-middle text-right font-bold text-green-600">${v.total_final?.toLocaleString('es-CL')}</td>
                         </tr>
                     ))
                 )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
              <DialogTitle>Registrar Venta de Cosecha</DialogTitle>
          </DialogHeader>
          <RegistrarVenta />
      </Dialog>
    </div>
  )
}

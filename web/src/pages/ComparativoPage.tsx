import React, { useMemo, useState } from 'react'
import { api } from '../api'
import { Line } from 'react-chartjs-2'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { cn } from '../lib/utils'
import { StatsCard } from '../components/StatsCard'
import { TrendingUp, Calendar, CheckCircle } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ComparativoPage() {
  const [lineaId, setLineaId] = useState('')
  const [predictionData, setPredictionData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  async function cargarPrediccion() {
    if (!lineaId) return
    setLoading(true)
    try {
      // Connect to Spring Boot Backend
      const response = await fetch(`http://localhost:8080/api/predict/harvest?linea_id=${lineaId}`)
      if (!response.ok) throw new Error("Error connecting to Backend")
      const data = await response.json()
      setPredictionData(data)
    } catch (e) {
      console.error(e)
      alert("Error: No se pudo conectar con el servicio de predicción en el puerto 8080")
    } finally {
      setLoading(false)
    }
  }

  const chartData = useMemo(() => {
    if (!predictionData) return null
    return {
      labels: predictionData.predicciones.map((p: any) => p.mes),
      datasets: [
        {
          label: 'Crecimiento Proyectado (mm)',
          data: predictionData.predicciones.map((p: any) => p.talla_estimada_mm),
          borderColor: 'rgb(79, 70, 229)', // Indigo-600
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          borderDash: [5, 5], // Dashed line for prediction
          tension: 0.4,
        }
      ]
    }
  }, [predictionData])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Proyección de Crecimiento</h2>
        <p className="text-slate-500">Estimación de talla y fecha óptima de cosecha basada en datos históricos.</p>
      </div>

      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
           <CardTitle>Parámetros del Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid gap-2 w-full md:w-auto">
              <label className="text-sm font-medium text-slate-700">Línea a Analizar (ID)</label>
              <Input placeholder="Ej: 20" value={lineaId} onChange={e => setLineaId(e.target.value)} className="w-full md:w-64" />
            </div>
            <Button onClick={cargarPrediccion} disabled={loading} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? "Analizando..." : "Ejecutar Predicción"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {predictionData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Cards for Prediction */}
            <div className="grid gap-6 md:grid-cols-3">
                 <StatsCard 
                    title="Cosecha Recomendada" 
                    value={predictionData.recomendacion_cosecha}
                    description="Pico de biomasa estimado"
                    icon={Calendar}
                    trend="neutral"
                 />
                 <StatsCard 
                    title="Rentabilidad Estimada" 
                    value={predictionData.rentabilidad_estimada}
                    description="Basado en precios actuales"
                    icon={TrendingUp}
                    trend="up"
                 />
                 <StatsCard 
                    title="Probabilidad de Éxito" 
                    value="94%"
                    description="Certeza estadística"
                    icon={CheckCircle}
                    trend="neutral"
                 />
            </div>

            {/* Prediction Chart */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle>Curva de Crecimiento Proyectada</CardTitle>
              </CardHeader>
               <CardContent>
                 <div className="h-[400px] w-full">
                   <Line data={chartData as any} options={{ 
                       maintainAspectRatio: false,
                       plugins: {
                           legend: { position: 'top' as const },
                           title: { display: true, text: `Predicción Evolutiva - Línea ${lineaId}` }
                       },
                       scales: {
                           y: { beginAtZero: false, title: { display: true, text: 'Talla (mm)' } }
                       }
                   }} />
                 </div>
               </CardContent>
            </Card>

            {/* Predicted Growth Table */}
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-800">Detalle de Proyección Mensual</CardTitle>
                    <p className="text-sm text-slate-500">Desglose mes a mes con intervalos de confianza del 95%.</p>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableHead className="w-[150px]">Mes Proyectado</TableHead>
                                <TableHead>Talla Estimada</TableHead>
                                <TableHead className="hidden md:table-cell">Rango (Min - Max)</TableHead>
                                <TableHead>Confianza</TableHead>
                                <TableHead className="text-right">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {predictionData.predicciones.map((pred: any, index: number) => (
                                <TableRow key={index} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-medium text-slate-700">{pred.mes}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{pred.talla_estimada_mm} mm</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                            {pred.talla_min_mm} - {pred.talla_max_mm} mm
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full" 
                                                    style={{ width: `${pred.probabilidad_exito * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-600 font-medium">{(pred.probabilidad_exito * 100).toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700",
                                            index === 8 ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : ""
                                        )}>
                                            {index === 8 ? "Cosecha Óptima" : "En Crecimiento"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  )
}

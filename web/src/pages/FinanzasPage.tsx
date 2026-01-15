import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { api } from '../api'

// Simple formatter
const fmtMoney = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n)

export default function FinanzasPage() {
  const [resumen, setResumen] = useState<any>(null)
  const [gastos, setGastos] = useState<any[]>([])
  
  // New Expense Form State
  const [desc, setDesc] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('MANO_OBRA')
  const [msg, setMsg] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const loadData = async () => {
    try {
        const resResumen = await api.get('/finanzas/resumen')
        setResumen(resResumen)
        const resGastos = await api.get('/finanzas/gastos')
        setGastos(resGastos)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadData() }, [])

  const handleSaveGasto = async () => {
    try {
        await api.post('/finanzas/gastos', { description: desc, monto: Number(monto), categoria, descripcion: desc })
        setMsg('Gasto registrado')
        setDesc('')
        setMonto('')
        loadData()
        setTimeout(() => setIsOpen(false), 1000)
    } catch(e) { console.error(e); setMsg('Error') }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">Finanzas</h2>
            <p className="text-slate-500">Control de Márgenes y Rentabilidad</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">Registrar Gasto</Button>

        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DialogHeader><DialogTitle>Nuevo Gasto Operativo</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>Descripción</Label>
                    <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ej: Compra Petróleo" />
                </div>
                <div className="grid gap-2">
                    <Label>Monto (CLP)</Label>
                    <Input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0" />
                </div>
                <div className="grid gap-2">
                    <Label>Categoría</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoria} onChange={e => setCategoria(e.target.value)}>
                        <option value="MANO_OBRA">Mano de Obra</option>
                        <option value="SEMILLA">Compra Semilla</option>
                        <option value="PETROLEO">Combustible</option>
                        <option value="MANTENCION">Mantención</option>
                        <option value="OTROS">Otros</option>
                    </select>
                </div>
                <Button onClick={handleSaveGasto}>Guardar</Button>
                {msg && <p className="text-center text-sm text-green-600">{msg}</p>}
            </div>
        </Dialog>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Ingresos Totales (Ventas)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-800">{fmtMoney(resumen?.total_ingresos || 0)}</div>
            </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Gastos Operativos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600">- {fmtMoney(resumen?.total_gastos || 0)}</div>
            </CardContent>
        </Card>
        <Card className="bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-100">Margen Neto Real</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{fmtMoney(resumen?.margen_neto || 0)}</div>
                <p className="text-xs text-indigo-200 mt-1">ROI: {Number(resumen?.roi_estimado || 0).toFixed(1)}%</p>
            </CardContent>
        </Card>
      </div>

      {/* EXPENSE TABLE */}
      <Card className="border-0 shadow-md">
        <CardHeader>
            <CardTitle>Historial de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {gastos.map((g: any) => (
                        <TableRow key={g.id}>
                            <TableCell>{g.fecha}</TableCell>
                            <TableCell className="font-medium">{g.descripcion}</TableCell>
                            <TableCell>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-full text-slate-600">{g.categoria}</span>
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-600">- {fmtMoney(g.monto)}</TableCell>
                        </TableRow>
                    ))}
                    {gastos.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-slate-500 py-8">No hay gastos registrados.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}

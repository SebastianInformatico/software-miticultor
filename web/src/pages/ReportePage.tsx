import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { Button } from '../components/ui/button'
import { Printer, Download, Anchor } from 'lucide-react'

// Types (simplified for report)
interface ResumenFinanciero {
    totalIngresos: number
    totalGastos: number
    margenNeto: number
    roiEstimado: number
}

interface Centro {
    id: number
    nombre: string
    totalLineasCapacidad: number
}

export default function ReportePage() {
  const [finanzas, setFinanzas] = useState<ResumenFinanciero | null>(null)
  const [centros, setCentros] = useState<Centro[]>([])
  
  // Date for the report
  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => {
    // Parallel data fetching
    Promise.all([
        api.get<ResumenFinanciero>('/finanzas/resumen'),
        api.get<Centro[]>('/centros')
    ]).then(([resFinanzas, resCentros]) => {
        setFinanzas(resFinanzas)
        setCentros(resCentros)
    }).catch(console.error)
  }, [])

  const handlePrint = () => {
      window.print()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
        {/* Actions Bar (Hidden when printing) */}
        <div className="fixed top-4 right-4 print:hidden flex gap-2">
            <Button onClick={handlePrint} className="bg-slate-900 text-white shadow-lg">
                <Printer className="mr-2 h-4 w-4" /> Imprimir / Guardar PDF
            </Button>
        </div>

        {/* A4 Paper Simulation */}
        <div className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl print:shadow-none print:w-full">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Informe Ejecutivo</h1>
                    <p className="text-slate-500 font-medium mt-1">Estado General de Operaciones</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-indigo-700 mb-1">
                        <Anchor className="h-6 w-6" />
                        <span className="font-bold text-xl">Miticultor PRO</span>
                    </div>
                    <p className="text-sm text-slate-400">{today}</p>
                </div>
            </div>

            {/* Financial Summary Section */}
            <section className="mb-10">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Resumen Financiero</h2>
                <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${finanzas?.totalIngresos.toLocaleString('es-CL') || 0}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Gastos Operativos</p>
                        <p className="text-2xl font-bold text-red-600">
                            -${finanzas?.totalGastos.toLocaleString('es-CL') || 0}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-900 text-white rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">Margen Neto Real</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            ${finanzas?.margenNeto.toLocaleString('es-CL') || 0}
                        </p>
                    </div>
                </div>
            </section>

            {/* Centers Status Section */}
            <section className="mb-10">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Estado de Centros</h2>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="py-2 font-semibold text-slate-700">ID</th>
                            <th className="py-2 font-semibold text-slate-700">Nombre del Centro</th>
                            <th className="py-2 font-semibold text-slate-700 text-right">Capacidad</th>
                            <th className="py-2 font-semibold text-slate-700 text-right">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {centros.map(c => (
                            <tr key={c.id}>
                                <td className="py-3 text-slate-500">#{c.id}</td>
                                <td className="py-3 font-medium text-slate-900">{c.nombre}</td>
                                <td className="py-3 text-right text-slate-600">{c.totalLineasCapacidad} Líneas</td>
                                <td className="py-3 text-right">
                                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">OPERATIVO</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Verification / Signature Area */}
            <div className="mt-20 pt-8 border-t border-dashed border-slate-300 grid grid-cols-2 gap-20">
                <div>
                    <p className="text-xs text-slate-400 mb-12">Firma Gerente de Operaciones</p>
                    <div className="border-b border-slate-300"></div>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-12">Firma Administrador Financiero</p>
                    <div className="border-b border-slate-300"></div>
                </div>
            </div>

            <div className="mt-10 text-center">
                 <p className="text-[10px] text-slate-300 uppercase">Generado automáticamente por Miticultor Software v2.0</p>
            </div>
        </div>
    </div>
  )
}

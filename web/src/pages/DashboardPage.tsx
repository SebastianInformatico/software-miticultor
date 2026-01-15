import React, { useState } from 'react'
import { StatsCard } from '../components/StatsCard'
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Sprout, Anchor, TrendingUp, DollarSign, Activity, PlusCircle, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

// Components for Modals
import CreateLinea from '../components/CreateLinea'
import CreateSemilla from '../components/CreateSemilla'
import AsignarSemilla from '../components/AsignarSemilla'
import MedidaCrecimiento from '../components/MedidaCrecimiento'



export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState<'linea' | 'semilla' | 'asignar' | 'medida' | null>(null)

  return (
    <div className="space-y-8">


      {/* 1. KPI Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Líneas Activas" 
            value="12" 
            description="+2 este mes"
            trend="up"
            icon={Anchor} 
        />
        <StatsCard 
            title="Semillas Sembradas" 
            value="24.5k" 
            description="Unidades estimadas"
            trend="neutral"
            icon={Sprout} 
        />
         <StatsCard 
            title="Cosecha Proyectada" 
            value="18 Ton" 
            description="Noviembre 2026"
            trend="up" 
            icon={TrendingUp} 
        />
         <StatsCard 
            title="Ventas Recientes" 
            value="$ 4.2M" 
            description="Últimos 30 días"
            trend="up" 
            icon={DollarSign} 
        />
      </div>

      {/* 2. Quick Actions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold tracking-tight text-slate-800">Acciones Rápidas</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Button onClick={() => setModalOpen('linea')} className="h-28 flex-col gap-3 bg-white hover:bg-indigo-50 border-0 shadow-md hover:shadow-xl text-slate-600 hover:text-indigo-600 transition-all duration-300 group" variant="outline">
                <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-white group-hover:scale-110 transition-transform">
                   <Anchor className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="font-semibold">Nueva Línea</span>
             </Button>
             <Button onClick={() => setModalOpen('semilla')} className="h-28 flex-col gap-3 bg-white hover:bg-emerald-50 border-0 shadow-md hover:shadow-xl text-slate-600 hover:text-emerald-600 transition-all duration-300 group" variant="outline">
                <div className="p-3 bg-emerald-50 rounded-full group-hover:bg-white group-hover:scale-110 transition-transform">
                   <Sprout className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="font-semibold">Ingresar Semilla</span>
             </Button>
             <Button onClick={() => setModalOpen('asignar')} className="h-28 flex-col gap-3 bg-white hover:bg-blue-50 border-0 shadow-md hover:shadow-xl text-slate-600 hover:text-blue-600 transition-all duration-300 group" variant="outline">
                <div className="p-3 bg-blue-50 rounded-full group-hover:bg-white group-hover:scale-110 transition-transform">
                   <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold">Asignar / Sembrar</span>
             </Button>
             <Button onClick={() => setModalOpen('medida')} className="h-28 flex-col gap-3 bg-white hover:bg-orange-50 border-0 shadow-md hover:shadow-xl text-slate-600 hover:text-orange-600 transition-all duration-300 group" variant="outline">
                <div className="p-3 bg-orange-50 rounded-full group-hover:bg-white group-hover:scale-110 transition-transform">
                   <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <span className="font-semibold">Registrar Medida</span>
             </Button>
        </div>
      </div>

      {/* 3. Recent Activity / Timeline */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-2xl border-0 bg-white text-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div>
                    <h3 className="font-bold leading-none tracking-tight">Actividad de Producción</h3>
                    <p className="text-sm text-slate-500 mt-1">Movimientos registrados en tiempo real.</p>
                 </div>
                 <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    Ver todo <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
            </div>
            <div className="p-0">
                <div className="divide-y divide-slate-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 hover:bg-slate-50 transition-colors">
                            <span className="relative flex h-3 w-3 mr-4 ml-2">
                              {i === 1 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                              <span className={cn("relative inline-flex rounded-full h-3 w-3", i === 1 ? "bg-emerald-500" : "bg-slate-300")}></span>
                            </span>
                            <div className="ml-4 space-y-1 flex-1">
                                <p className="text-sm font-semibold text-slate-800">Siembra Inicial - Línea {20+i}</p>
                                <p className="text-xs text-slate-400">Hace {i*2} horas • Usuario Admin</p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                +2.000 Unid
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
         <div className="col-span-3 rounded-2xl border-0 bg-white text-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold leading-none tracking-tight">Resumen Financiero</h3>
                <p className="text-sm text-slate-500 mt-1">Comparativa Ene '26</p>
            </div>
            <div className="p-6 flex flex-col items-center justify-center h-[300px] text-slate-400 gap-4">
                <div className="h-32 w-32 rounded-full border-8 border-slate-100 border-t-indigo-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-300">75%</span>
                </div>
                <p className="text-sm">Meta de Ventas</p>
            </div>
         </div>
      </div>

      {/* MODALS */}
      <Dialog isOpen={modalOpen === 'linea'} onClose={() => setModalOpen(null)}>
         <DialogHeader>
           <DialogTitle>Crear Nueva Línea</DialogTitle>
         </DialogHeader>
         <CreateLinea />
      </Dialog>
      
      {/* ... other modals reuse ... */}
      <Dialog isOpen={modalOpen === 'semilla'} onClose={() => setModalOpen(null)}>
         <DialogHeader>
           <DialogTitle>Ingresar Nueva Semilla</DialogTitle>
         </DialogHeader>
         <CreateSemilla />
      </Dialog>
      
      <Dialog isOpen={modalOpen === 'asignar'} onClose={() => setModalOpen(null)}>
         <DialogHeader>
           <DialogTitle>Asignar Semilla a Línea</DialogTitle>
         </DialogHeader>
         <AsignarSemilla />
      </Dialog>

       <Dialog isOpen={modalOpen === 'medida'} onClose={() => setModalOpen(null)}>
         <DialogHeader>
           <DialogTitle>Registrar Medida de Crecimiento</DialogTitle>
         </DialogHeader>
         <MedidaCrecimiento />
      </Dialog>
    </div>
  )
}

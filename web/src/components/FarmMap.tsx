import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'
import { api } from '../api'

interface LineaResumen {
    id: number
    nombre: string
    estado: string // ACTIVA, COSECHADA, PROBLEM
    coordenadaX: number
    coordenadaY: number
}

// Grid size configuration (e.g., 10x10 grid representing the sea concession)
const GRID_SIZE = 10 

export function FarmMap() {
    const [lineas, setLineas] = useState<LineaResumen[]>([])
    const [selectedLinea, setSelectedLinea] = useState<LineaResumen | null>(null)

    useEffect(() => {
        // Ideally, this should fetch lines for a specific center.
        // For now, we fetch all lines to display on the general map.
        api.get('/lineas').then(res => setLineas(res as LineaResumen[])).catch(console.error)
    }, [])

    // Helper to find a line at specific coordinates
    const getLineaAt = (x: number, y: number) => lineas.find(l => l.coordenadaX === x && l.coordenadaY === y)

    return (
        <Card className="border-0 shadow-2xl bg-[#0f172a] text-slate-100 overflow-hidden relative">
             {/* Decorative Background for 'Sea' effect */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <CardHeader className="relative z-10 border-b border-slate-800">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-white">Mapa del Centro de Cultivo</CardTitle>
                        <p className="text-xs text-slate-400">Vista aérea de la concesión (10x10 Sectores)</p>
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activa</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600"></span> Disponible</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 relative z-10 flex flex-col md:flex-row gap-8">
                
                {/* THE GRID */}
                <div className="flex-1 aspect-square max-w-[500px] mx-auto bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div 
                        className="grid gap-1 w-full h-full" 
                        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                    >
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                            const x = i % GRID_SIZE
                            const y = Math.floor(i / GRID_SIZE)
                            const linea = getLineaAt(x, y)
                            
                            return (
                                <div 
                                    key={i}
                                    onClick={() => linea && setSelectedLinea(linea)}
                                    className={cn(
                                        "rounded-sm transition-all duration-200 cursor-pointer relative group",
                                        linea 
                                            ? "bg-emerald-500/80 hover:bg-emerald-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10" 
                                            : "bg-slate-800/40 hover:bg-slate-700/60"
                                    )}
                                >
                                    {linea && (
                                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-900">
                                            {linea.id}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* DETAILS PANEL */}
                <div className="w-full md:w-64 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Detalle de Selección</h4>
                        {selectedLinea ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div>
                                    <p className="text-xs text-slate-500">Línea</p>
                                    <p className="text-lg font-bold text-white">{selectedLinea.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Estado</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {selectedLinea.estado}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Ubicación (Grid)</p>
                                    <p className="text-sm text-slate-300">X: {selectedLinea.coordenadaX}, Y: {selectedLinea.coordenadaY}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-center">
                                <p className="text-xs text-slate-500">Selecciona una celda activa para ver detalles.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 p-4 rounded-lg border border-indigo-500/30">
                        <p className="text-xs font-semibold text-indigo-300 mb-1">Capacidad Ocupada</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-white">{lineas.length}%</span>
                            <span className="text-xs text-slate-400 mb-1">del centro</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${lineas.length}%` }}></div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

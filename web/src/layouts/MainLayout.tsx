import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, BarChart3, Menu, X, User, ChevronRight, DollarSign, ClipboardList, Printer } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Centros', href: '/centros', icon: LayoutDashboard },
    { label: 'Dashboard', href: '/', icon: BarChart3 },
    { label: 'Ventas', href: '/ventas', icon: ShoppingCart },
    { label: 'Comparativo', href: '/comparativo', icon: BarChart3 },
    { label: 'Bitácora', href: '/bitacora', icon: ClipboardList },
    { label: 'Finanzas', href: '/finanzas', icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="font-bold text-lg text-slate-800">Miticultor Pro</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Premium Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-300 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Miticultor</h1>
             <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
               PRO VERSION
             </span>
          </div>
        </div>
        
        <div className="px-4 py-6">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 ring-1 ring-white/10" 
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800/50 bg-[#0f172a]">
           <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center ring-2 ring-slate-900 group-hover:ring-indigo-500 transition-all">
               <User className="h-5 w-5 text-white" />
             </div>
             <div>
               <p className="text-sm font-medium text-white group-hover:text-indigo-200 transition-colors">Usuario Admin</p>
               <p className="text-xs text-slate-500">admin@miticultor.com</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
         <header className="h-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex items-center px-8 justify-between sticky top-0 z-40">
           <div>
             <h2 className="text-2xl font-bold text-slate-800">
               {navItems.find(i => i.href === location.pathname)?.label || 'Panel de Control'}
             </h2>
             <p className="text-sm text-slate-500 hidden md:block">Bienvenido de vuelta, gestiona tu producción hoy.</p>
           </div>
           
           <div className="flex items-center gap-4">
             <Link to="/reporte">
                 <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-indigo-700 bg-indigo-50 border-indigo-100 hover:bg-indigo-100">
                     <Printer className="h-4 w-4" /> Reporte Ejecutivo
                 </Button>
             </Link>
             <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               v2.0.1
             </span>
           </div>
         </header>

         <main className="flex-1 p-6 md:p-10 overflow-auto scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
         </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

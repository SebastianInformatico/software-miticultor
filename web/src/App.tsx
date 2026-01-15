import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import DashboardPage from './pages/DashboardPage'
import VentasPage from './pages/VentasPage'
import ComparativoPage from './pages/ComparativoPage'
import FinanzasPage from './pages/FinanzasPage'
import CentrosPage from './pages/CentrosPage'
import BitacoraPage from './pages/BitacoraPage'


export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/comparativo" element={<ComparativoPage />} />
          <Route path="/finanzas" element={<FinanzasPage />} />
          <Route path="/comparativo" element={<ComparativoPage />} />
          <Route path="/finanzas" element={<FinanzasPage />} />
          <Route path="/centros" element={<CentrosPage />} />
          <Route path="/bitacora" element={<BitacoraPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

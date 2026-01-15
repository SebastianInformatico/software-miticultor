package com.miticultor

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@Repository
interface GastoRepository : JpaRepository<Gasto, Long>

@RestController
@RequestMapping("/api/finanzas")
@CrossOrigin(origins = ["http://localhost:5173"])
class FinanzasController(
    private val gastoRepository: GastoRepository,
    private val ventaRepository: VentaRepository
) {

    @PostMapping("/gastos")
    fun registrarGasto(@RequestBody gasto: Gasto): Gasto = gastoRepository.save(gasto)

    @GetMapping("/gastos")
    fun listarGastos(): List<Gasto> = gastoRepository.findAll()

    @GetMapping("/resumen")
    fun getResumenMensual(): Map<String, Any> {
        val ventas = ventaRepository.findAll()
        val gastos = gastoRepository.findAll()

        // Simple aggregation logic
        val totalVentas = ventas.sumOf { it.totalFinal.toDouble() }
        val totalGastos = gastos.sumOf { it.monto }
        val margen = totalVentas - totalGastos

        return mapOf(
            "total_ingresos" to totalVentas,
            "total_gastos" to totalGastos,
            "margen_neto" to margen,
            "roi_estimado" to if (totalGastos > 0) (margen / totalGastos) * 100 else 0.0
        )
    }
}

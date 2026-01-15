package com.miticultor

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/ventas")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:5174"])
class VentaController(private val repository: VentaRepository) {

    @GetMapping
    fun getAll(): List<Venta> = repository.findAll()

    @PostMapping
    fun create(@RequestBody venta: Venta): Venta {
        return repository.save(venta)
    }
}

// Additional controller for Reports/Stats to handle the specific frontend endpoints
@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:5174"])
class ReporteController(private val ventaRepository: VentaRepository) {

    @GetMapping("/ventas-por-linea/{lineaId}")
    fun getVentasPorLinea(@PathVariable lineaId: Long): List<Map<String, Any>> {
        val ventas = ventaRepository.findByLineaId(lineaId)
        // Map to snake_case for frontend compatibility if needed, though frontend seems to accept standard JSON
        return ventas.map { v ->
            mapOf(
                "id" to v.id,
                "fecha" to v.fecha.toString(),
                "comprador" to v.comprador,
                "kilos" to v.kilos,
                "precio_por_kilo" to v.precioPorKilo,
                "total_final" to v.totalFinal
            )
        }
    }
}

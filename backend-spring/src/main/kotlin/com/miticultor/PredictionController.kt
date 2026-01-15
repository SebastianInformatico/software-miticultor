package com.miticultor

import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlin.math.min
import kotlin.random.Random

@RestController
@RequestMapping("/api/predict")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:5174"])
class PredictionController {

    @GetMapping("/harvest")
    fun predictHarvest(@RequestParam("linea_id") lineaId: Long): Map<String, Any> {
        // Mock prediction logic based on a simple linear growth model
        // In a real scenario, this would query historical data for the specific line
        
        val currentDate = LocalDate.now()
        val predicciones = mutableListOf<Map<String, Any>>()
        var currentSize = 25.0 // Starting size in mm (e.g., seedling size)
        
        // Generate 12 months of projection
        for (i in 0 until 12) {
            // Growth rate slows down as they get bigger (simple logistic-like curve simulator)
            val growthRate = if (currentSize < 50) 4.5 else if (currentSize < 70) 3.0 else 1.5
            val variance = Random.nextDouble(-0.5, 0.5) // Slight random variance
            
            currentSize += (growthRate + variance)
            
            // Confidence intervals
            val minSize = currentSize * 0.95
            val maxSize = currentSize * 1.05
            val probability = if (currentSize > 60) 0.95 else 0.80 + (currentSize / 300.0)

            val monthDate = currentDate.plusMonths(i.toLong())
            val monthName = monthDate.format(DateTimeFormatter.ofPattern("MMMM yyyy"))

            predicciones.add(mapOf(
                "mes" to monthName,
                "talla_estimada_mm" to  String.format("%.1f", currentSize).toDouble(),
                "talla_min_mm" to String.format("%.1f", minSize).toDouble(),
                "talla_max_mm" to String.format("%.1f", maxSize).toDouble(),
                "probabilidad_exito" to probability
            ))
        }

        // Determine optimal harvest (e.g., when size > 70mm or max value)
        val optimalHarvest = predicciones.find { (it["talla_estimada_mm"] as Double) > 70.0 } ?: predicciones.last()
        
        return mapOf(
            "recomendacion_cosecha" to optimalHarvest["mes"]!!,
            "rentabilidad_estimada" to "$12.5M", // Mocked profitability
            "predicciones" to predicciones
        )
    }
}

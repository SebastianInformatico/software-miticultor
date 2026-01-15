package com.miticultor

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate

@Entity
@Table(name = "ventas")
data class Venta(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    val lineaId: Long,
    val fecha: LocalDate,
    val comprador: String,
    val kilos: BigDecimal,
    val precioPorKilo: BigDecimal,
    val descuentos: BigDecimal,
    val totalFinal: BigDecimal
)

@Entity
data class Gasto(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val lineaId: Long? = null, // Can be null for general expenses
    val descripcion: String,
    val categoria: String, // SEMILLA, PETROLEO, MANO_OBRA, MANTENCION
    val monto: Double,
    val fecha: LocalDate = LocalDate.now()
)

package com.miticultor

import jakarta.persistence.*
import java.time.LocalDate

@Entity
data class CentroCultivo(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val nombre: String,
    val ubicacionGeografica: String,
    val totalLineasCapacidad: Int = 100
)

@Entity
data class Linea(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val nombre: String,
    val ubicacion: String, // Keep for backward compatibility or specific sector detail
    val fechaSiembra: LocalDate = LocalDate.now(),
    val estado: String = "ACTIVA", // ACTIVA, COSECHADA
    val coordenadaX: Int = 0,
    val coordenadaY: Int = 0,
    
    val centroId: Long? = null // Link to CentroCultivo
)

@Entity
data class Semilla(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val proveedor: String,
    val tipo: String,
    val fechaIngreso: LocalDate = LocalDate.now(),
    val cantidadInicial: Double
)

@Entity
data class RegistroCrecimiento(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne
    val linea: Linea,
    
    val fechaMedicion: LocalDate = LocalDate.now(),
    val tallaPromedioMm: Double,
    val pesoPromedioG: Double,
    val temperaturaAgua: Double? = null
)

@Entity
data class EventoBitacora(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val fecha: LocalDate = LocalDate.now(),
    val tipo: String, // SIEMBRA, COSECHA, MANTENCION, MAREA_ROJA, OTRO
    val descripcion: String,
    val centroId: Long, // Mandatory link to center
    val lineaId: Long? = null // Optional specific line
)

package com.miticultor

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/bitacora")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:5174"])
class BitacoraController(
    private val repo: EventoBitacoraRepository
) {
    @GetMapping
    fun getAll(): List<EventoBitacora> = repo.findAll()

    @GetMapping("/centro/{centroId}")
    fun getByCentro(@PathVariable centroId: Long): List<EventoBitacora> = repo.findByCentroIdOrderByFechaDesc(centroId)

    @PostMapping
    fun create(@RequestBody evento: EventoBitacora): EventoBitacora = repo.save(evento)
}

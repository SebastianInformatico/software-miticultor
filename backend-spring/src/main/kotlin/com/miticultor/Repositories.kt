package com.miticultor

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate



@Repository
interface SemillaRepository : JpaRepository<Semilla, Long>

@Repository
interface CentroCultivoRepository : JpaRepository<CentroCultivo, Long>

@Repository
interface LineaRepository : JpaRepository<Linea, Long> {
    fun findByCentroId(centroId: Long): List<Linea>
}

@Repository
interface RegistroCrecimientoRepository : JpaRepository<RegistroCrecimiento, Long> {
    fun findByLineaIdOrderByFechaMedicionAsc(lineaId: Long): List<RegistroCrecimiento>
}

@Repository
interface EventoBitacoraRepository : JpaRepository<EventoBitacora, Long> {
    fun findByCentroIdOrderByFechaDesc(centroId: Long): List<EventoBitacora>
}

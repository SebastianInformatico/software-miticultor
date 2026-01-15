package com.miticultor

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VentaRepository : JpaRepository<Venta, Long> {
    fun findByLineaId(lineaId: Long): List<Venta>
}

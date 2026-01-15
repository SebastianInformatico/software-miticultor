package com.miticultor

import org.springframework.web.bind.annotation.*
import java.util.Optional

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:5174"])
class ProductionController(
    private val lineaRepository: LineaRepository,
    private val semillaRepository: SemillaRepository,
    private val registroRepository: RegistroCrecimientoRepository,
    private val centroRepository: CentroCultivoRepository
) {

    // --- CENTROS DE CULTIVO ---
    @GetMapping("/centros")
    fun getAllCentros(): List<CentroCultivo> = centroRepository.findAll()

    @PostMapping("/centros")
    fun createCentro(@RequestBody centro: CentroCultivo): CentroCultivo = centroRepository.save(centro)

    @GetMapping("/centros/{id}/lineas")
    fun getLineasByCentro(@PathVariable id: Long): List<Linea> = lineaRepository.findByCentroId(id)

    // --- LINEAS ---
    @GetMapping("/lineas")
    fun getAllLineas(): List<Linea> = lineaRepository.findAll()

    @PostMapping("/lineas")
    fun createLinea(@RequestBody linea: Linea): Linea = lineaRepository.save(linea)
    
    @GetMapping("/lineas/{id}")
    fun getLinea(@PathVariable id: Long): Optional<Linea> = lineaRepository.findById(id)

    // --- SEMILLAS ---
    @GetMapping("/semillas")
    fun getAllSemillas(): List<Semilla> = semillaRepository.findAll()

    @PostMapping("/semillas")
    fun createSemilla(@RequestBody semilla: Semilla): Semilla = semillaRepository.save(semilla)

    // --- REGISTROS CRECIMIENTO ---
    @PostMapping("/registros")
    fun addRegistro(@RequestBody registro: RegistroCrecimiento): RegistroCrecimiento {
        return registroRepository.save(registro)
    }

    @GetMapping("/lineas/{id}/historial")
    fun getHistorial(@PathVariable id: Long): List<RegistroCrecimiento> {
        return registroRepository.findByLineaIdOrderByFechaMedicionAsc(id)
    }
}

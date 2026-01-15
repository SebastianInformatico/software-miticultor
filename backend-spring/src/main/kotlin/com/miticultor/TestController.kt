package com.miticultor

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.CrossOrigin

@RestController
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:5174"])
class TestController {

    @GetMapping("/api/status")
    fun status(): Map<String, String> {
        return mapOf("status" to "online", "message" to "Backend Profesional Miticultor Funcionando!")
    }
}

# Miticultor Pro 3.0 - Sistema de Gestión Acuícola

Software integral para la administración, finanzas y trazabilidad de centros de cultivo de choritos.

## Arquitectura del Sistema

El sistema opera bajo una arquitectura de microservicios distribuida:

### 1. Backend Principal (Spring Boot)

- **Tecnología**: Kotlin, Java 17, Spring Boot 3.2.
- **Puerto**: `8080`.
- **Base de Datos**: H2 (Memoria para desarrollo) / PostgreSQL (Producción).
- **Responsabilidad**: Gestión de Entidades (Centros, Líneas, Ventas, Gastos), Reglas de Negocio.

### 2. Frontend (React)

- **Tecnología**: React 18, TypeScript, Vite, Tailwind CSS.
- **Puerto**: `5173`.
- **Responsabilidad**: Interfaz de Usuario "Pro", Gráficos, Mapas, Reportes PDF.

### 3. Analytics (Python)

- **Tecnología**: FastAPI, Pandas, Scikit-learn.
- **Puerto**: `8000`.
- **Responsabilidad**: Cálculos de predicción de crecimiento y análisis de datos complejos.

---

## Instrucciones de Instalación y Ejecución

Para levantar el sistema completo, debe ejecutar los servicios en el siguiente orden:

### Paso 1: Backend Spring Boot

```bash
cd backend-spring
mvn spring-boot:run
```

_Esperar a que aparezca "Started MiticultorApplicationKt"._

### Paso 2: Backend Python (Analytics)

```bash
cd backend-python
uvicorn main:app --reload --port 8000
```

### Paso 3: Frontend Web

```bash
cd web
npm run dev
```

_Acceder a la aplicación en: `http://localhost:5173`_

---

## Funcionalidades Principales (Pro 3.0)

1.  **Administración de Centros**: Jerarquía real (Centro -> Línea).
2.  **Módulo Financiero**: Cálculo automático de ROI y Márgenes.
3.  **Bitácora de Operaciones**: Registro histórico de eventos.
4.  **Mapa Interactivo**: Control visual de la producción.
5.  **Reporte Ejecutivo**: Generación de PDFs para gerencia.

---

**Desarrollado para Miticultor por [Tu Nombre/Agencia]**

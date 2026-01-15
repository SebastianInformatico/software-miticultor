from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from datetime import date
import csv
import io
from openpyxl import Workbook

from .database import engine, init_db
from .models import (
    Linea,
    Semilla,
    CompraSemilla,
    LineaSemillaAsignacion,
    Cosecha,
    Venta,
    MedidaCrecimiento,
    ComparativoNota,
)

app = FastAPI(title="Software Miticultor")

# Init DB
init_db()

# Serve static UI
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")


# ----- Create / Inyección de información -----
@app.post("/lineas", response_model=Linea)
def crear_linea(linea: Linea):
    with Session(engine) as session:
        session.add(linea)
        session.commit()
        session.refresh(linea)
        return linea


@app.post("/semillas", response_model=Semilla)
def crear_semilla(semilla: Semilla):
    with Session(engine) as session:
        session.add(semilla)
        session.commit()
        session.refresh(semilla)
        return semilla


@app.post("/compras-semilla", response_model=CompraSemilla)
def crear_compra(compra: CompraSemilla):
    # Compras de semilla
    with Session(engine) as session:
        # validar semilla
        semilla = session.get(Semilla, compra.semilla_id)
        if not semilla:
            raise HTTPException(status_code=404, detail="Semilla no encontrada")
        session.add(compra)
        session.commit()
        session.refresh(compra)
        return compra


@app.post("/lineas/{linea_id}/asignar-semilla", response_model=LineaSemillaAsignacion)
def asignar_semilla(linea_id: int, asignacion: LineaSemillaAsignacion):
    # ¿A qué línea se le recarga esa semilla?
    with Session(engine) as session:
        linea = session.get(Linea, linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        semilla = session.get(Semilla, asignacion.semilla_id)
        if not semilla:
            raise HTTPException(status_code=404, detail="Semilla no encontrada")
        asignacion.linea_id = linea_id
        session.add(asignacion)
        session.commit()
        session.refresh(asignacion)
        return asignacion


@app.post("/cosechas", response_model=Cosecha)
def registrar_cosecha(cosecha: Cosecha):
    # ¿Cuándo coseché? ¿Cuántas unidades/kilos?
    with Session(engine) as session:
        linea = session.get(Linea, cosecha.linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        session.add(cosecha)
        session.commit()
        session.refresh(cosecha)
        return cosecha


@app.post("/ventas", response_model=Venta)
def registrar_venta(venta: Venta):
    # Módulo de ventas
    with Session(engine) as session:
        linea = session.get(Linea, venta.linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        # calcular pago total si no provisto
        if venta.pago_total is None:
            venta.pago_total = venta.cantidad * venta.precio_unitario - (venta.descuento or 0)
        session.add(venta)
        session.commit()
        session.refresh(venta)
        return venta


@app.post("/medidas", response_model=MedidaCrecimiento)
def registrar_medida(medida: MedidaCrecimiento):
    # Medidas de crecimiento
    with Session(engine) as session:
        linea = session.get(Linea, medida.linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        session.add(medida)
        session.commit()
        session.refresh(medida)
        return medida


@app.post("/comparativo-nota", response_model=ComparativoNota)
def registrar_comparativo_nota(nota: ComparativoNota):
    with Session(engine) as session:
        linea = session.get(Linea, nota.linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        session.add(nota)
        session.commit()
        session.refresh(nota)
        return nota


# ----- Reportes -----
@app.get("/reportes/ventas-por-linea/{linea_id}")
def ventas_por_linea(linea_id: int, desde: date | None = None, hasta: date | None = None):
    with Session(engine) as session:
        stmt = select(Venta).where(Venta.linea_id == linea_id)
        if desde:
            stmt = stmt.where(Venta.fecha >= desde)
        if hasta:
            stmt = stmt.where(Venta.fecha <= hasta)
        ventas = session.exec(stmt).all()
        return [
            {
                "venta_id": v.id,
                "fecha": v.fecha,
                "planta": v.planta,  # ¿A qué planta le vendí?
                "cantidad": v.cantidad,
                "precio_unitario": v.precio_unitario,
                "descuento": v.descuento,  # ¿Cuánto me descontó?
                "motivo_descuento": v.motivo_descuento,  # ¿Qué me descontó?
                "pago_total": v.pago_total,  # ¿Cuánto me pagó?
            }
            for v in ventas
        ]


@app.get("/export/ventas-por-linea/{linea_id}.csv")
def export_ventas_por_linea_csv(linea_id: int, desde: date | None = None, hasta: date | None = None):
    # Exporta ventas por línea a CSV con filtros opcionales de fecha
    with Session(engine) as session:
        stmt = select(Venta).where(Venta.linea_id == linea_id)
        if desde:
            stmt = stmt.where(Venta.fecha >= desde)
        if hasta:
            stmt = stmt.where(Venta.fecha <= hasta)
        ventas = session.exec(stmt).all()
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(["venta_id", "fecha", "planta", "cantidad", "precio_unitario", "descuento", "motivo_descuento", "pago_total"])
        for v in ventas:
            writer.writerow([v.id, v.fecha, v.planta, v.cantidad, v.precio_unitario, v.descuento, v.motivo_descuento or "", v.pago_total])
        content = buf.getvalue()
        headers = {"Content-Disposition": f"attachment; filename=ventas_linea_{linea_id}.csv"}
        return Response(content=content, media_type="text/csv", headers=headers)


@app.get("/reportes/ventas-resumen")
def ventas_resumen(linea_id: int, desde: date, hasta: date):
    # Totales de ingresos y descuentos por período y línea
    with Session(engine) as session:
        stmt = select(Venta).where((Venta.linea_id == linea_id) & (Venta.fecha >= desde) & (Venta.fecha <= hasta))
        ventas = session.exec(stmt).all()
        total_cantidad = sum(v.cantidad for v in ventas)
        total_bruto = sum(v.cantidad * v.precio_unitario for v in ventas)
        total_descuento = sum(v.descuento or 0 for v in ventas)
        total_pago = sum(v.pago_total for v in ventas)
        # desglose por planta
        por_planta: dict[str, dict[str, float]] = {}
        for v in ventas:
            d = por_planta.setdefault(v.planta, {"cantidad": 0.0, "bruto": 0.0, "descuento": 0.0, "pago": 0.0})
            d["cantidad"] += v.cantidad
            d["bruto"] += v.cantidad * v.precio_unitario
            d["descuento"] += v.descuento or 0
            d["pago"] += v.pago_total
        desglose = [
            {"planta": k, "cantidad": v["cantidad"], "bruto": v["bruto"], "descuento": v["descuento"], "pago": v["pago"]}
            for k, v in por_planta.items()
        ]
        return {
            "linea_id": linea_id,
            "desde": desde,
            "hasta": hasta,
            "total_cantidad": total_cantidad,
            "total_bruto": total_bruto,
            "total_descuento": total_descuento,
            "total_pago": total_pago,
            "desglose_planta": desglose,
        }


@app.get("/reportes/siembra-cosecha/{linea_id}")
def siembra_cosecha(linea_id: int):
    with Session(engine) as session:
        linea = session.get(Linea, linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        cosechas = session.exec(select(Cosecha).where(Cosecha.linea_id == linea_id)).all()
        total_kilos = sum(c.unidades_kilos for c in cosechas)
        return {
            "linea_id": linea.id,
            "nombre": linea.nombre,
            "siembra_inicial": linea.siembra_inicial,
            "siembra_final": linea.siembra_final,
            "cosechas": [
                {"fecha": c.fecha, "unidades_kilos": c.unidades_kilos} for c in cosechas
            ],
            "total_kilos": total_kilos,
        }


@app.get("/export/siembra-cosecha/{linea_id}.csv")
def export_siembra_cosecha_csv(linea_id: int):
    with Session(engine) as session:
        linea = session.get(Linea, linea_id)
        if not linea:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        cosechas = session.exec(select(Cosecha).where(Cosecha.linea_id == linea_id)).all()
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(["linea_id", "nombre", "siembra_inicial", "siembra_final", "fecha_cosecha", "unidades_kilos"])
        if not cosechas:
            writer.writerow([linea.id, linea.nombre, linea.siembra_inicial or "", linea.siembra_final or "", "", ""])
        else:
            for c in cosechas:
                writer.writerow([linea.id, linea.nombre, linea.siembra_inicial or "", linea.siembra_final or "", c.fecha, c.unidades_kilos])
        content = buf.getvalue()
        headers = {"Content-Disposition": f"attachment; filename=siembra_cosecha_linea_{linea_id}.csv"}
        return Response(content=content, media_type="text/csv", headers=headers)


@app.get("/reportes/comparativo")
def comparativo(anio_desde: int, anio_hasta: int):
    # Cuadro comparativo año 2026-2027: ¿Qué cambió? ¿Cuántas unidades? ¿Qué mejoró? ¿Por qué mejoró?
    with Session(engine) as session:
        # Sumar cosechas por año y línea
        cosechas = session.exec(select(Cosecha)).all()
        por_anio_linea: dict[tuple[int, int], float] = {}
        for c in cosechas:
            anio = c.fecha.year
            key = (c.linea_id, anio)
            por_anio_linea[key] = por_anio_linea.get(key, 0.0) + c.unidades_kilos

        resultado = []
        # Considerar todas las líneas
        lineas = session.exec(select(Linea)).all()
        for linea in lineas:
            u_desde = por_anio_linea.get((linea.id, anio_desde), 0.0)
            u_hasta = por_anio_linea.get((linea.id, anio_hasta), 0.0)
            cambio = u_hasta - u_desde
            mejoro = cambio > 0
            razon = session.exec(
                select(ComparativoNota).where(
                    (ComparativoNota.linea_id == linea.id) & (ComparativoNota.anio == anio_hasta)
                )
            ).first()
            resultado.append(
                {
                    "linea_id": linea.id,
                    "nombre": linea.nombre,
                    "anio_desde": anio_desde,
                    "anio_hasta": anio_hasta,
                    "unidades_desde": u_desde,
                    "unidades_hasta": u_hasta,
                    "cambio": cambio,
                    "mejoro": mejoro,
                    "razon_mejora": razon.razon_mejora if razon else None,
                }
            )
        return resultado


@app.get("/export/comparativo.xlsx")
def export_comparativo_excel(anio_desde: int, anio_hasta: int):
    # Genera Excel del comparativo por todas las líneas
    with Session(engine) as session:
        datos = comparativo(anio_desde, anio_hasta)
        wb = Workbook()
        ws = wb.active
        ws.title = "Comparativo"
        ws.append(["linea_id", "nombre", "anio_desde", "anio_hasta", "unidades_desde", "unidades_hasta", "cambio", "mejoro", "razon_mejora"])
        for d in datos:
            ws.append([
                d["linea_id"], d["nombre"], d["anio_desde"], d["anio_hasta"],
                d["unidades_desde"], d["unidades_hasta"], d["cambio"], d["mejoro"], d.get("razon_mejora") or ""
            ])
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        headers = {"Content-Disposition": f"attachment; filename=comparativo_{anio_desde}_{anio_hasta}.xlsx"}
        return StreamingResponse(output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)


# ----- Helpers de lectura simples -----
@app.get("/lineas")
def listar_lineas():
    with Session(engine) as session:
        return session.exec(select(Linea)).all()


@app.get("/semillas")
def listar_semillas():
    with Session(engine) as session:
        return session.exec(select(Semilla)).all()

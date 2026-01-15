from datetime import date
from sqlmodel import Session

from app.database import engine, init_db
from app.models import Linea, Semilla, LineaSemillaAsignacion, Cosecha, Venta, MedidaCrecimiento, ComparativoNota


def main():
    init_db()
    with Session(engine) as session:
        # Línea 20
        linea20 = Linea(nombre="Línea 20", siembra_inicial=date(2026, 1, 15), siembra_final=date(2026, 3, 15))
        session.add(linea20)
        session.commit(); session.refresh(linea20)

        # Semilla inicial recién captada
        semilla = Semilla(nombre="Semilla inicial", origen="captada", fecha_alta=date(2026, 1, 10))
        session.add(semilla)
        session.commit(); session.refresh(semilla)

        # Asignación a la línea 20
        asig = LineaSemillaAsignacion(linea_id=linea20.id, semilla_id=semilla.id, fecha=date(2026, 1, 16), cantidad=100.0)
        session.add(asig)

        # Medida de crecimiento
        med = MedidaCrecimiento(linea_id=linea20.id, fecha=date(2026, 2, 10), medida=12.5, notas="Buen desarrollo")
        session.add(med)

        # Cosecha (kilos)
        cosecha = Cosecha(linea_id=linea20.id, fecha=date(2026, 7, 20), unidades_kilos=250.0)
        session.add(cosecha)

        # Venta con descuento y motivo
        venta = Venta(
            fecha=date(2026, 8, 1),
            planta="Planta Norte",
            linea_id=linea20.id,
            cantidad=200.0,
            precio_unitario=5.0,
            descuento=100.0,
            motivo_descuento="Por volumen",
            pago_total=200.0 * 5.0 - 100.0,
        )
        session.add(venta)

        # Nota de mejora para 2027
        nota = ComparativoNota(linea_id=linea20.id, anio=2027, razon_mejora="Mejor selección de semilla", notas=None)
        session.add(nota)

        session.commit()
        print("Datos de ejemplo cargados: Línea 20")


if __name__ == "__main__":
    main()

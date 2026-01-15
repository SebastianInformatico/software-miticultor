from __future__ import annotations
from datetime import date
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship


class Linea(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    siembra_inicial: Optional[date] = None
    siembra_final: Optional[date] = None

    asignaciones: list[LineaSemillaAsignacion] = Relationship(back_populates="linea")
    cosechas: list[Cosecha] = Relationship(back_populates="linea")
    ventas: list[Venta] = Relationship(back_populates="linea")
    medidas: list[MedidaCrecimiento] = Relationship(back_populates="linea")


class Semilla(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    origen: Optional[str] = None
    fecha_alta: Optional[date] = None

    compras: list[CompraSemilla] = Relationship(back_populates="semilla")
    asignaciones: list[LineaSemillaAsignacion] = Relationship(back_populates="semilla")


class CompraSemilla(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    semilla_id: int = Field(foreign_key="semilla.id")
    fecha: date
    proveedor: Optional[str] = None
    cantidad: float = 0.0
    costo: float = 0.0

    semilla: Optional[Semilla] = Relationship(back_populates="compras")


class LineaSemillaAsignacion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    linea_id: int = Field(foreign_key="linea.id")
    semilla_id: int = Field(foreign_key="semilla.id")
    fecha: date
    cantidad: float = 0.0

    linea: Optional[Linea] = Relationship(back_populates="asignaciones")
    semilla: Optional[Semilla] = Relationship(back_populates="asignaciones")


class Cosecha(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    linea_id: int = Field(foreign_key="linea.id")
    fecha: date
    unidades_kilos: float

    linea: Optional[Linea] = Relationship(back_populates="cosechas")


class Venta(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: date
    planta: str  # A qué planta le vendí
    linea_id: int = Field(foreign_key="linea.id")
    cantidad: float
    precio_unitario: float
    descuento: float = 0.0
    motivo_descuento: Optional[str] = None
    pago_total: float

    linea: Optional[Linea] = Relationship(back_populates="ventas")


class MedidaCrecimiento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    linea_id: int = Field(foreign_key="linea.id")
    fecha: date
    medida: float  # por ejemplo altura en cm
    notas: Optional[str] = None

    linea: Optional[Linea] = Relationship(back_populates="medidas")


class ComparativoNota(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    linea_id: int = Field(foreign_key="linea.id")
    anio: int
    razon_mejora: Optional[str] = None
    notas: Optional[str] = None

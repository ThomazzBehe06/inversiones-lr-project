import { Injectable } from '@angular/core';

export interface Reserva {
  id: string;
  titulo: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string;
  noches: number;
  huespedes: number;
  precioNoche?: number;
  subtotal?: number;
  tarifaLimpieza?: number;
  tarifaServicio?: number;
  total: number;
  estado: string;
  imagenUrl: string;
}

@Injectable({ providedIn: 'root' })
export class Reservas {
  private readonly claveAlmacenamiento = 'inversiones-lr-reservas';

  obtenerReservas(): Reserva[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const guardadas = localStorage.getItem(this.claveAlmacenamiento);
      return guardadas ? (JSON.parse(guardadas) as Reserva[]) : [];
    } catch {
      return [];
    }
  }

  guardarReserva(reserva: Reserva): void {
    const reservas = this.obtenerReservas();
    localStorage.setItem(this.claveAlmacenamiento, JSON.stringify([reserva, ...reservas]));
  }
}

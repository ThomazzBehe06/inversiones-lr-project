import { Injectable, inject } from '@angular/core';
import { SesionService } from './sesion.service';

export interface Reserva {
  id: string;
  alojamientoId?: number;
  titulo: string;
  ciudad?: string;
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
  nombreHuesped?: string;
  correo?: string;
  estado: string;
  imagenUrl: string;
}

@Injectable({ providedIn: 'root' })
export class Reservas {
  private sesionService = inject(SesionService);
  private readonly prefijoClave = 'inversiones-lr-reservas:';

  obtenerReservas(): Reserva[] {
    const clave = this.claveUsuario();

    if (!clave) {
      return [];
    }

    try {
      const guardadas = localStorage.getItem(clave);
      return guardadas ? (JSON.parse(guardadas) as Reserva[]) : [];
    } catch {
      return [];
    }
  }

  guardarReserva(reserva: Reserva): void {
    const clave = this.claveUsuario();

    if (!clave) {
      return;
    }

    const reservas = this.obtenerReservas();
    localStorage.setItem(clave, JSON.stringify([reserva, ...reservas]));
  }

  private claveUsuario(): string {
    const correo = this.sesionService.usuarioActual().correo.toLowerCase();
    return correo ? this.prefijoClave + correo : '';
  }
}

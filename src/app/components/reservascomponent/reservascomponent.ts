import { Component, OnInit } from '@angular/core';
import { Reserva, Reservas } from '../../services/reservas';
import { MonedaService } from '../../services/moneda.service';

@Component({
  selector: 'app-reservascomponent',
  standalone: false,
  templateUrl: './reservascomponent.html',
  styleUrl: './reservascomponent.css',
})

export class Reservascomponent implements OnInit {
  reservas: Reserva[] = [];
  nuevaReservaId: string | null = null;
  reservaPorEliminar: string | null = null;
  mensajeEliminada = false;

  constructor(
    private reservasService: Reservas,
    private monedaService: MonedaService,
  ) {}

  ngOnInit(): void {
    this.reservas = this.reservasService.obtenerReservas();

    const { nuevaReserva, ...resto } = history.state ?? {};
    if (typeof nuevaReserva === 'string' && this.reservas.some((r) => r.id === nuevaReserva)) {
      this.nuevaReservaId = nuevaReserva;
      history.replaceState(resto, '');
    }
  }

  pedirConfirmacion(id: string): void {
    this.reservaPorEliminar = id;
  }

  cancelarEliminacion(): void {
    this.reservaPorEliminar = null;
  }

  eliminarReserva(id: string): void {
    this.reservasService.eliminarReserva(id);
    this.reservas = this.reservasService.obtenerReservas();
    this.reservaPorEliminar = null;
    this.nuevaReservaId = null;
    this.mensajeEliminada = true;
  }

  codigoReserva(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  formatoFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${fecha}T00:00:00`));
  }

  formatoPrecio(valor: number): string {
    return this.monedaService.formatear(valor);
  }
}

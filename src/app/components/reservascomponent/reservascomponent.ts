import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva, Reservas } from '../../services/reservas';

@Component({
  selector: 'app-reservascomponent',
  imports: [CommonModule],
  templateUrl: './reservascomponent.html',
  styleUrl: './reservascomponent.css',
})
export class Reservascomponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(private reservasService: Reservas) {}

  ngOnInit(): void {
    this.reservas = this.reservasService.obtenerReservas();
  }

  formatoFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${fecha}T00:00:00`));
  }

  formatoPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO');
  }
}

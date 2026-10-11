import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reserva, Reservas } from '../../services/reservas';
import { MonedaService } from '../../services/moneda.service';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-reservascomponent',
  standalone: false,
  templateUrl: './reservascomponent.html',
  styleUrl: './reservascomponent.css',
})

export class Reservascomponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(
    private reservasService: Reservas,
    private monedaService: MonedaService,
    private sesionService: SesionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.sesionService.logueado()) {
      void this.router.navigate(['/login'], { queryParams: { volver: '/reservas' } });
      return;
    }

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
    return this.monedaService.formatear(valor);
  }
}

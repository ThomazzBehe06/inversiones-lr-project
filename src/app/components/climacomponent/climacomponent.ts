import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { ClimaService } from '../../services/clima.service';
import { Clima } from '../../models/clima';

@Component({
  selector: 'app-climacomponent',
  standalone: false,
  styleUrl: './climacomponent.css',
  templateUrl: './climacomponent.html',
})
export class Climacomponent implements OnChanges {
  private climaService = inject(ClimaService);

  // Datos que envia el detalle
  @Input() latitud?: number;
  @Input() longitud?: number;
  @Input() ciudad = '';

  // Estado de la tarjeta
  clima = signal<Clima | null>(null);
  cargando = signal(false);
  error = signal(false);

  // Se ejecuta cada vez que cambian las coordenadas
  ngOnChanges(): void {
    if (!this.tieneCoordenadas()) return;

    this.cargando.set(true);
    this.error.set(false);

    this.climaService.getClima(this.latitud!, this.longitud!).subscribe({
      next: (datos) => {
        this.clima.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  // Sin coordenadas no se muestra la tarjeta
  tieneCoordenadas(): boolean {
    return this.latitud != null && this.longitud != null;
  }
}

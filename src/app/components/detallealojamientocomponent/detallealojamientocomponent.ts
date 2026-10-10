import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { AlojamientoService } from '../../services/alojamiento.service';
import { Reservas } from '../../services/reservas';
import { MonedaService } from '../../services/moneda.service';

const TARIFA_SERVICIO = 0.1;

interface Cotizacion {
  noches: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  total: number;
}

@Component({
  selector: 'app-detallealojamientocomponent',
  standalone: false,
  templateUrl: './detallealojamientocomponent.html',
  styleUrl: './detallealojamientocomponent.css',
})

export class Detallealojamientocomponent {
  private alojamientoService = inject(AlojamientoService);
  private reservasService = inject(Reservas);
  private router = inject(Router);
  monedaService = inject(MonedaService);


  private datos = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      switchMap((params) => this.alojamientoService.getAlojamiento(Number(params.get('id')))),
      map((alojamiento) => ({ alojamiento })),
      catchError(() => of({ alojamiento: null })),
    ),
  );

  cargando = computed(() => this.datos() === undefined);
  alojamiento = computed(() => this.datos()?.alojamiento ?? null);
  imagenSeleccionada = linkedSignal(() => this.alojamiento()?.imagenPrincipal ?? '');

  hoy = this.fechaComoTexto(new Date());
  fechaLlegada = signal(this.hoy);
  fechaSalida = signal(this.sumarDias(this.hoy, 1));
  huespedes = signal<number | null>(1);
  fechaMinimaSalida = computed(() => this.sumarDias(this.fechaLlegada() || this.hoy, 1));

  error = computed(() => {
    const alojamiento = this.alojamiento();
    const llegada = this.fechaLlegada();
    const salida = this.fechaSalida();
    const huespedes = this.huespedes();

    if (!alojamiento) return '';
    if (!llegada || !salida) return 'Selecciona la fecha de llegada y de salida.';
    if (llegada < this.hoy) return 'La fecha de llegada no puede ser anterior a hoy.';
    if (salida <= llegada) return 'La fecha de salida debe ser posterior a la de llegada.';
    if (!huespedes || huespedes < 1 || !Number.isInteger(huespedes)) {
      return 'El número de huéspedes debe ser mayor que cero.';
    }
    if (huespedes > alojamiento.capacidad) {
      return `Este alojamiento admite máximo ${alojamiento.capacidad} huéspedes.`;
    }
    return '';
  });

  cotizacion = computed<Cotizacion | null>(() => {
    const alojamiento = this.alojamiento();
    if (!alojamiento || this.error()) return null;

    const noches = this.diferenciaEnDias(this.fechaLlegada(), this.fechaSalida());
    const subtotal = noches * alojamiento.precioNoche;
    const tarifaServicio = Math.round(subtotal * TARIFA_SERVICIO);
    return {
      noches,
      subtotal,
      tarifaLimpieza: alojamiento.tarifaLimpieza,
      tarifaServicio,
      total: subtotal + alojamiento.tarifaLimpieza + tarifaServicio,
    };
  });

  cambiarFechaLlegada(fecha: string): void {
    this.fechaLlegada.set(fecha);
    if (fecha && this.fechaSalida() <= fecha) this.fechaSalida.set(this.sumarDias(fecha, 1));
  }

  confirmarReserva(): void {
    const alojamiento = this.alojamiento();
    const cotizacion = this.cotizacion();
    if (!alojamiento || !cotizacion) return;

    this.reservasService.guardarReserva({
      id: crypto.randomUUID(),
      titulo: alojamiento.nombre,
      ubicacion: alojamiento.ubicacion || alojamiento.ciudad,
      fechaInicio: this.fechaLlegada(),
      fechaFin: this.fechaSalida(),
      huespedes: this.huespedes()!,
      precioNoche: alojamiento.precioNoche,
      ...cotizacion,
      estado: 'CONFIRMADA',
      imagenUrl: alojamiento.imagenPrincipal,
    });
    void this.router.navigate(['/reservas']);
  }

  formatoPrecio(valor: number): string {
    return this.monedaService.formatear(valor);
  }

  private sumarDias(fecha: string, dias: number): string {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return this.fechaComoTexto(new Date(anio, mes - 1, dia + dias));
  }

  private diferenciaEnDias(inicio: string, fin: string): number {
    const comoUtc = (fecha: string) => {
      const [anio, mes, dia] = fecha.split('-').map(Number);
      return Date.UTC(anio, mes - 1, dia);
    };
    return (comoUtc(fin) - comoUtc(inicio)) / 86_400_000;
  }

  private fechaComoTexto(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}

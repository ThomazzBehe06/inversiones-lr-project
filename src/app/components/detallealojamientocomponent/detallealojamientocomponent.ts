import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Alojamiento, Resena } from '../../models/alojamiento';
import { AlojamientoService } from '../../services/alojamiento.service';
import { Reservas } from '../../services/reservas';
import { MonedaService } from '../../services/moneda.service';

const TARIFA_SERVICIO = 0.1;
const IMAGEN_RESPALDO = 'assets/images/sin-imagen.svg';
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Cotizacion {
  noches: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  total: number;
}

interface DatosDetalle {
  alojamiento: Alojamiento | null;
  resenas: Resena[];
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
      switchMap((params) => {
        const id = Number(params.get('id'));
        return forkJoin({
          alojamiento: this.alojamientoService.getAlojamiento(id),
          resenas: this.alojamientoService
            .getResenas()
            .pipe(map((lista) => lista.filter((r) => r.alojamientoId === id))),
        });
      }),
      catchError(() => of<DatosDetalle>({ alojamiento: null, resenas: [] })),
    ),
  );

  cargando = computed(() => this.datos() === undefined);
  alojamiento = computed(() => this.datos()?.alojamiento ?? null);
  resenas = computed(() => this.datos()?.resenas ?? []);
  imagenSeleccionada = linkedSignal(() => this.alojamiento()?.imagenPrincipal ?? '');

  promedioResenas = computed(() => {
    const lista = this.resenas();
    if (lista.length === 0) return null;
    return lista.reduce((suma, r) => suma + r.calificacion, 0) / lista.length;
  });

  // Cotización
  hoy = this.fechaComoTexto(new Date());
  fechaLlegada = signal(this.hoy);
  fechaSalida = signal(this.sumarDias(this.hoy, 1));
  huespedes = signal<number | null>(1);
  fechaMinimaSalida = computed(() => this.sumarDias(this.fechaLlegada() || this.hoy, 1));

  // Formulario de reserva
  mostrarFormulario = signal(false);
  intentoEnvio = signal(false);
  nombreHuesped = signal('');
  correo = signal('');

  readonly estrellas = [1, 2, 3, 4, 5];

  error = computed(() => {
    const alojamiento = this.alojamiento();
    const llegada = this.fechaLlegada();
    const salida = this.fechaSalida();
    const huespedes = this.huespedes();

    if (!alojamiento) return '';
    if (alojamiento.precioNoche <= 0) return 'Este alojamiento no tiene un precio válido.';
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

  formularioVisible = computed(() => this.mostrarFormulario() && !!this.cotizacion());

  errorNombre = computed(() =>
    this.nombreHuesped().trim().length < 3 ? 'Ingresa tu nombre completo (mínimo 3 caracteres).' : '',
  );
  errorCorreo = computed(() => {
    const correo = this.correo().trim();
    if (!correo) return 'Ingresa tu correo electrónico.';
    return REGEX_CORREO.test(correo) ? '' : 'Ingresa un correo electrónico válido.';
  });

  cambiarFechaLlegada(fecha: string): void {
    this.fechaLlegada.set(fecha);
    if (fecha && this.fechaSalida() <= fecha) this.fechaSalida.set(this.sumarDias(fecha, 1));
  }

  abrirFormulario(): void {
    if (this.cotizacion()) this.mostrarFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.intentoEnvio.set(false);
  }

  confirmarReserva(): void {
    this.intentoEnvio.set(true);

    const alojamiento = this.alojamiento();
    const cotizacion = this.cotizacion();
    if (!alojamiento || !cotizacion || this.errorNombre() || this.errorCorreo()) return;

    const idReserva = this.generarId();
    this.reservasService.guardarReserva({
      id: idReserva,
      alojamientoId: alojamiento.id,
      titulo: alojamiento.nombre,
      ciudad: alojamiento.ciudad,
      ubicacion: alojamiento.ubicacion || alojamiento.ciudad,
      fechaInicio: this.fechaLlegada(),
      fechaFin: this.fechaSalida(),
      huespedes: this.huespedes()!,
      precioNoche: alojamiento.precioNoche,
      ...cotizacion,
      nombreHuesped: this.nombreHuesped().trim(),
      correo: this.correo().trim(),
      estado: 'CONFIRMADA',
      imagenUrl: alojamiento.imagenPrincipal,
    });
    void this.router.navigate(['/reservas'], { state: { nuevaReserva: idReserva } });
  }

  formatoPrecio(valor: number): string {
    return this.monedaService.formatear(valor);
  }

  alFallarImagen(evento: Event): void {
    const imagen = evento.target as HTMLImageElement;
    if (!imagen.src.endsWith(IMAGEN_RESPALDO)) imagen.src = IMAGEN_RESPALDO;
  }

  private generarId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AlojamientoService } from '../../services/alojamiento.service';
import { Alojamiento } from '../../models/alojamiento';

// Filtros del buscador
interface Filtros {
  ciudad?: string;
  tipo?: string;
  llegada?: string;
  salida?: string;
  huespedes?: number;
  precioMax?: number;
  calificacionMin?: number;
}

// Tarjeta con foto (categorias y lugares)
interface Tarjeta {
  nombre: string;
  imagen: string;
  filtro: Filtros & { categoria?: string };
}

@Component({
  imports: [FormsModule, RouterLink, CurrencyPipe],
  selector: 'app-iniciocomponent',
  styleUrl: './iniciocomponent.css',
  templateUrl: './iniciocomponent.html',
})
export class Iniciocomponent {
  private alojamientoService = inject(AlojamientoService);
  private router = inject(Router);

  // Fecha de hoy (yyyy-MM-dd)
  protected hoy = this.fechaLocal(new Date());

  // Buscador
  protected filtros: Filtros = {};
  protected opcionesPrecio = [200000, 300000, 400000, 500000, 700000];
  protected opcionesCalificacion = [4.5, 4, 3.5];

  // Categorias
  protected categorias: Tarjeta[] = [
    { nombre: 'Urbano', imagen: 'assets/images/categoria-urbano.jpg', filtro: { categoria: 'Urbano' } },
    { nombre: 'Playas', imagen: 'assets/images/categoria-playas.jpg', filtro: { categoria: 'Playas' } },
    { nombre: 'Rural', imagen: 'assets/images/categoria-rural.jpg', filtro: { categoria: 'Rural' } },
  ];

  // Lugares populares
  protected lugares: Tarjeta[] = [
    { nombre: 'Santa Marta', imagen: 'assets/images/ciudad-santa-marta.jpg', filtro: { ciudad: 'Santa Marta' } },
    { nombre: 'Bogotá', imagen: 'assets/images/ciudad-bogota.jpg', filtro: { ciudad: 'Bogotá' } },
    { nombre: 'Cartagena de Indias', imagen: 'assets/images/ciudad-cartagena.jpg', filtro: { ciudad: 'Cartagena' } },
    { nombre: 'Medellín', imagen: 'assets/images/ciudad-medellin.jpg', filtro: { ciudad: 'Medellín' } },
    { nombre: 'San Andrés', imagen: 'assets/images/ciudad-san-andres.jpg', filtro: { ciudad: 'San Andrés' } },
    { nombre: 'Cali', imagen: 'assets/images/ciudad-cali.jpg', filtro: { ciudad: 'Cali' } },
  ];

  // Datos del JSON
  protected errorCarga = signal(false);
  protected alojamientos = toSignal<Alojamiento[] | undefined>(
    this.alojamientoService.getAlojamientos().pipe(
      catchError(() => {
        this.errorCarga.set(true);
        return of([]);
      }),
    ),
  );

  // Destacados (undefined = cargando)
  protected destacados = computed(() => this.alojamientos()?.filter((a) => a.destacado));

  // Opciones de Donde y Tipo
  protected ciudades = computed(() => this.unicos(this.alojamientos()?.map((a) => a.ciudad)));
  protected tipos = computed(() => this.unicos(this.alojamientos()?.map((a) => a.tipo)));

  // Validacion de fechas
  get errorFechas(): string | null {
    const { llegada, salida } = this.filtros;
    if (llegada && llegada < this.hoy) {
      return 'La fecha de llegada no puede ser anterior a hoy.';
    }
    if (llegada && salida && salida <= llegada) {
      return 'La fecha de salida debe ser posterior a la de llegada.';
    }
    return null;
  }

  // Boton buscar
  buscar(): void {
    if (this.errorFechas) return;

    // Solo filtros con valor
    const queryParams = Object.fromEntries(
      Object.entries(this.filtros).filter(([, valor]) => valor !== null && valor !== undefined && valor !== ''),
    );
    this.router.navigate(['/alojamientos'], { queryParams });
  }

  // Boton limpiar
  limpiarFiltros(): void {
    this.filtros = {};
  }

  // Imagen de reemplazo
  imagenNoDisponible(evento: Event): void {
    const img = evento.target as HTMLImageElement;
    if (!img.src.endsWith('sin-imagen.svg')) {
      img.src = 'assets/images/sin-imagen.svg';
    }
  }

  // Fondo de tarjeta: sombra + foto + color de respaldo
  fondo(imagen: string): string {
    return `linear-gradient(90deg, rgb(10 25 60 / 0.55), rgb(10 25 60 / 0.05)), url('${imagen}'), linear-gradient(135deg, #2b4f9e, #6dbac0)`;
  }

  // Lista sin repetidos
  private unicos(lista: string[] = []): string[] {
    return [...new Set(lista)].sort();
  }

  private fechaLocal(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}

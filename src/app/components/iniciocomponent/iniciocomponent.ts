import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlojamientoService } from '../../services/alojamiento.service';
import { Alojamiento, Resena } from '../../models/alojamiento';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-iniciocomponent',
  styleUrl: './iniciocomponent.css',
  templateUrl: './iniciocomponent.html',
})
export class Iniciocomponent {
  alojamientos: Alojamiento[] = [];
  destacados: Alojamiento[] = [];
  resenas: Resena[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];
  cargando: boolean = true;
  error: boolean = false;
  ciudad: string = '';
  tipo: string = '';
  huespedes: number | null = null;
  precioMin: number | null = null;
  precioMax: number | null = null;
  calificacionMin: number | null = null;
  opcionesCalificacion: number[] = [4.5, 4, 3.5];
  menu: string = '';
  categorias = [
    { nombre: 'Urbano', imagen: 'assets/images/categoria-urbano.jpg' },
    { nombre: 'Playas', imagen: 'assets/images/categoria-playas.jpg' },
    { nombre: 'Rural', imagen: 'assets/images/categoria-rural.jpg' },
  ];

  lugares = [
    { nombre: 'Santa Marta', ciudad: 'Santa Marta', imagen: 'assets/images/ciudad-santa-marta.jpg' },
    { nombre: 'Bogotá', ciudad: 'Bogotá', imagen: 'assets/images/ciudad-bogota.jpg' },
    { nombre: 'Cartagena de Indias', ciudad: 'Cartagena', imagen: 'assets/images/ciudad-cartagena.jpg' },
    { nombre: 'Medellín', ciudad: 'Medellín', imagen: 'assets/images/ciudad-medellin.jpg' },
    { nombre: 'San Andrés', ciudad: 'San Andrés', imagen: 'assets/images/ciudad-san-andres.jpg' },
    { nombre: 'Cali', ciudad: 'Cali', imagen: 'assets/images/ciudad-cali.jpg' },
  ];

  constructor(
    private alojamientoService: AlojamientoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.alojamientoService.getAlojamientos().subscribe({
      next: (lista) => {
        this.alojamientos = lista;
        this.destacados = lista.filter((a) => a.destacado).slice(0, 6);
        this.ciudades = [...new Set(lista.map((a) => a.ciudad))].sort();
        this.tipos = [...new Set(lista.map((a) => a.tipo))].sort();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.error = true;
        this.cdr.detectChanges();
      },
    });

    this.alojamientoService.getResenas().subscribe((lista) => {
      this.resenas = lista
        .filter((r) => r.calificacion === 5)
        .sort((a, b) => (b.foto ? 1 : 0) - (a.foto ? 1 : 0))
        .slice(0, 4);
      this.cdr.detectChanges();
    });
  }

  buscar(): void {
    this.router.navigate(['/alojamientos'], {
      queryParams: {
        ciudad: this.ciudad || null,
        tipo: this.tipo || null,
        huespedes: this.huespedes || null,
        precioMin: this.precioMin || null,
        precioMax: this.precioMax || null,
        calificacionMin: this.calificacionMin || null,
      },
      fragment: 'resultados',
    });
  }

  limpiarFiltros(): void {
    this.ciudad = '';
    this.tipo = '';
    this.huespedes = null;
    this.precioMin = null;
    this.precioMax = null;
    this.calificacionMin = null;
    this.menu = '';
  }

  abrirMenu(nombre: string): void {
    this.menu = this.menu === nombre ? '' : nombre;
  }

  cerrarMenu(): void {
    this.menu = '';
  }

  formatoPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO');
  }

  textoPrecio(): string {
    if (this.precioMin && this.precioMax) {
      return this.formatoPrecio(this.precioMin) + ' – ' + this.formatoPrecio(this.precioMax);
    }
    if (this.precioMin) {
      return 'Desde ' + this.formatoPrecio(this.precioMin);
    }
    if (this.precioMax) {
      return 'Hasta ' + this.formatoPrecio(this.precioMax);
    }
    return 'Añadir rango';
  }

  textoServicios(alojamiento: Alojamiento): string {
    return alojamiento.servicios.join(' · ');
  }

  estrellas(calificacion: number): string {
    return '★'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
  }

  nombreAlojamiento(id: number): string {
    return this.alojamientos.find((a) => a.id === id)?.nombre ?? '';
  }

  fondo(imagen: string): string {
    return `linear-gradient(90deg, rgb(10 25 60 / 0.55), rgb(10 25 60 / 0.05)), url('${imagen}')`;
  }
}

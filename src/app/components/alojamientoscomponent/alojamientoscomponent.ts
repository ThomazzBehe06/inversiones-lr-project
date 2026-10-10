import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlojamientoService } from '../../services/alojamiento.service';
import { Alojamiento } from '../../models/alojamiento';
import { Filtros } from '../../models/filtros';
import { MonedaService } from '../../services/moneda.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-alojamientoscomponent',
  styleUrl: './alojamientoscomponent.css',
  templateUrl: './alojamientoscomponent.html',
})
export class Alojamientoscomponent {
  alojamientos: Alojamiento[] = [];
  resultados: Alojamiento[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];
  cargando = true;
  error = false;
  porPagina = 12;
  paginaActual = 1;
  filtros: Filtros = this.filtrosVacios();
  opcionesCalificacion = [4.5, 4, 3.5];
  menu = '';
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private monedaService: MonedaService,
  ) {}

  ngOnInit(): void {
    this.alojamientoService.getAlojamientos().subscribe({
      next: (lista) => {
        this.alojamientos = lista;
        this.ciudades = [...new Set(lista.map((a) => a.ciudad))].sort();
        this.tipos = [...new Set(lista.map((a) => a.tipo))].sort();
        this.cargando = false;

        this.route.queryParams.subscribe((params) => {
          this.filtros = this.filtrosVacios();
          this.filtros.busqueda = params['busqueda'] || '';
          this.filtros.ciudad = params['ciudad'] || '';
          this.filtros.tipo = params['tipo'] || '';
          this.filtros.categoria = params['categoria'] || '';
          this.filtros.huespedes = this.aNumero(params['huespedes']);
          this.filtros.precioMin = this.aNumero(params['precioMin']);
          this.filtros.precioMax = this.aNumero(params['precioMax']);
          this.filtros.calificacionMin = this.aNumero(params['calificacionMin']);
          this.buscar();
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.cargando = false;
        this.error = true;
        this.cdr.detectChanges();
      },
    });
  }

  buscar(): void {
    this.resultados = this.alojamientoService.filtrar(this.alojamientos, this.filtros);
    this.paginaActual = 1;
  }

  limpiarFiltros(): void {
    this.filtros = this.filtrosVacios();
    this.menu = '';
    this.buscar();
  }

  verResultados(): void {
    this.buscar();
    this.irAResultados();
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
    const { precioMin, precioMax } = this.filtros;
    if (precioMin && precioMax) return `${this.formatoPrecio(precioMin)} – ${this.formatoPrecio(precioMax)}`;
    if (precioMin) return 'Desde ' + this.formatoPrecio(precioMin);
    if (precioMax) return 'Hasta ' + this.formatoPrecio(precioMax);
    return 'Añadir rango';
  }

  textoServicios(alojamiento: Alojamiento): string {
    return alojamiento.servicios.join(' · ');
  }

  get paginados(): Alojamiento[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.resultados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.resultados.length / this.porPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.irAResultados();
  }

  irAResultados(): void {
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' });
  }

  fondo(imagen: string): string {
    return `linear-gradient(90deg, rgb(10 25 60 / 0.55), rgb(10 25 60 / 0.05)), url('${imagen}')`;
  }

  private filtrosVacios(): Filtros {
    return {
      busqueda: '',
      ciudad: '',
      tipo: '',
      categoria: '',
      huespedes: null,
      precioMin: null,
      precioMax: null,
      calificacionMin: null,
    };
  }

  private aNumero(valor: string | undefined): number | null {
    return valor ? Number(valor) : null;
  }

  precioConvertido(valorCOP: number): string {
    return this.monedaService.formatear(valorCOP);
  }
}

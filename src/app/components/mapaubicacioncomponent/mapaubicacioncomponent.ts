import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapaubicacioncomponent',
  standalone: false,
  templateUrl: './mapaubicacioncomponent.html',
  styleUrl: './mapaubicacioncomponent.css',
})
export class Mapaubicacioncomponent {
  latitud = input.required<number>();
  longitud = input.required<number>();
  titulo = input<string>('');
  direccion = input<string>('');

  private contenedor = viewChild.required<ElementRef<HTMLDivElement>>('mapa');
  private mapa?: L.Map;
  private marcador?: L.Marker;
  private listo = signal(false);

  constructor() {
    afterNextRender(() => {
      this.crearMapa();
      this.listo.set(true);
    });

    effect(() => {
      const latitud = this.latitud();
      const longitud = this.longitud();
      const titulo = this.titulo();
      const direccion = this.direccion();
      if (!this.listo()) return;
      this.actualizarUbicacion(latitud, longitud, titulo, direccion);
    });

    inject(DestroyRef).onDestroy(() => this.mapa?.remove());
  }

  get enlaceMapa(): string {
    const lat = this.latitud();
    const lng = this.longitud();
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  }

  private crearMapa(): void {
    this.mapa = L.map(this.contenedor().nativeElement, {
      center: [this.latitud(), this.longitud()],
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapa);

    this.mapa.on('click', () => this.mapa?.scrollWheelZoom.enable());
    this.mapa.on('mouseout', () => this.mapa?.scrollWheelZoom.disable());

    this.actualizarUbicacion(this.latitud(), this.longitud(), this.titulo(), this.direccion());
  }

  private actualizarUbicacion(latitud: number, longitud: number, titulo: string, direccion: string): void {
    if (!this.mapa) return;

    const posicion: L.LatLngExpression = [latitud, longitud];
    this.mapa.setView(posicion, this.mapa.getZoom());

    if (!this.marcador) {
      this.marcador = L.marker(posicion, { icon: this.crearIcono(), title: titulo }).addTo(this.mapa);
    } else {
      this.marcador.setLatLng(posicion);
    }

    this.marcador.bindPopup(this.crearPopup(titulo, direccion));
  }

  private crearIcono(): L.DivIcon {
    return L.divIcon({
      className: '',
      html: '<i class="bi bi-geo-alt-fill" style="font-size:2.4rem;color:#13347b;text-shadow:0 2px 4px rgb(0 0 0 / .35)"></i>',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -34],
    });
  }

  private crearPopup(titulo: string, direccion: string): HTMLElement {
    const popup = document.createElement('div');
    const nombre = document.createElement('strong');
    nombre.textContent = titulo;
    popup.appendChild(nombre);

    if (direccion) {
      popup.appendChild(document.createElement('br'));
      popup.appendChild(document.createTextNode(direccion));
    }
    return popup;
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Alojamiento, MarketplaceData, Resena } from '../models/alojamiento';
import { Filtros } from '../models/filtros';

@Injectable({ providedIn: 'root' })
export class AlojamientoService {
  private http = inject(HttpClient);
  private url = 'assets/data/marketplace-data.json';

  getAlojamientos(): Observable<Alojamiento[]> {
    return this.http.get<MarketplaceData>(this.url).pipe(
      map((datos) => datos.alojamientos.filter((a) => a.activo)),
    );
  }

  getResenas(): Observable<Resena[]> {
    return this.http.get<MarketplaceData>(this.url).pipe(
      map((datos) => datos.resenas),
    );
  }

  filtrar(lista: Alojamiento[], filtros: Filtros): Alojamiento[] {
    const ciudad = this.limpiarTexto(filtros.ciudad);
    const busqueda = this.limpiarTexto(filtros.busqueda);

    return lista.filter((a) => {
      const coincideCiudad = ciudad === '' || this.limpiarTexto(a.ciudad).includes(ciudad);

      const coincideBusqueda =
        busqueda === '' ||
        this.limpiarTexto(a.nombre + ' ' + a.ciudad + ' ' + a.tipo).includes(busqueda);

      const coincideTipo = filtros.tipo === '' || a.tipo === filtros.tipo;
      const coincideCategoria = filtros.categoria === '' || a.categoria === filtros.categoria;
      const coincideHuespedes = filtros.huespedes === null || a.capacidad >= filtros.huespedes;
      const coincidePrecio = filtros.precioMax === null || a.precioNoche <= filtros.precioMax;
      const coincideCalificacion =
        filtros.calificacionMin === null || a.calificacion >= filtros.calificacionMin;

      return (
        coincideCiudad &&
        coincideBusqueda &&
        coincideTipo &&
        coincideCategoria &&
        coincideHuespedes &&
        coincidePrecio &&
        coincideCalificacion
      );
    });
  }

  private limpiarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}

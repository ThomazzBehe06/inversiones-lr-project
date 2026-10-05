import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Alojamiento, MarketplaceData } from '../models/alojamiento';

// Lee el JSON de alojamientos
@Injectable({ providedIn: 'root' })
export class AlojamientoService {
  private http = inject(HttpClient);
  private url = 'assets/data/marketplace-data.json';

  // Solo alojamientos activos
  getAlojamientos(): Observable<Alojamiento[]> {
    return this.http.get<MarketplaceData>(this.url).pipe(
      map((datos) => datos.alojamientos.filter((a) => a.activo)),
    );
  }
}

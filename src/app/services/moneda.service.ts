import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Moneda } from '../models/moneda';

interface TasaApi {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

@Injectable({
  providedIn: 'root',
})
export class MonedaService {
  private url: string = 'https://api.frankfurter.dev/v2/rates';
  private claveMoneda: string = 'monedaSeleccionada';

  monedas: Moneda[] = [
    { codigo: 'COP', nombre: 'Peso colombiano', simbolo: '$', decimales: 0, tasa: 1 },
    { codigo: 'USD', nombre: 'Dólar estadounidense', simbolo: 'US$', decimales: 2, tasa: 0.00025 },
    { codigo: 'EUR', nombre: 'Euro', simbolo: '€', decimales: 2, tasa: 0.00022 },
    { codigo: 'GBP', nombre: 'Libra esterlina', simbolo: '£', decimales: 2, tasa: 0.00019 },
    { codigo: 'MXN', nombre: 'Peso mexicano', simbolo: 'MX$', decimales: 2, tasa: 0.0046 },
    { codigo: 'BRL', nombre: 'Real brasileño', simbolo: 'R$', decimales: 2, tasa: 0.00135 },
    { codigo: 'CAD', nombre: 'Dólar canadiense', simbolo: 'CA$', decimales: 2, tasa: 0.00034 },
    { codigo: 'JPY', nombre: 'Yen japonés', simbolo: '¥', decimales: 0, tasa: 0.0375 },
    { codigo: 'CHF', nombre: 'Franco suizo', simbolo: 'CHF', decimales: 2, tasa: 0.0002 },
    { codigo: 'AUD', nombre: 'Dólar australiano', simbolo: 'AU$', decimales: 2, tasa: 0.00038 },
    { codigo: 'CNY', nombre: 'Yuan chino', simbolo: 'CN¥', decimales: 2, tasa: 0.0018 },
  ];

  monedaActual = signal<Moneda>(this.monedas[0]);
  usandoRespaldo: boolean = false;

  constructor(private http: HttpClient) {
    const guardada = localStorage.getItem(this.claveMoneda);
    const encontrada = this.monedas.find((m) => m.codigo === guardada);

    if (encontrada) {
      this.monedaActual.set(encontrada);
    }
  }

  cargarTasas(): Observable<boolean> {
    const quotes = this.monedas
      .filter((m) => m.codigo !== 'COP')
      .map((m) => m.codigo)
      .join(',');

    return this.http.get<TasaApi[]>(`${this.url}?base=COP&quotes=${quotes}`).pipe(
      map((filas) => {
        let actualizadas = 0;

        for (const fila of filas) {
          const moneda = this.monedas.find((m) => m.codigo === fila.quote);

          if (moneda && fila.rate > 0) {
            moneda.tasa = fila.rate;
            actualizadas++;
          }
        }

        this.usandoRespaldo = actualizadas === 0;
        this.refrescarMonedaActual();
        return actualizadas > 0;
      }),

      catchError(() => {
        this.usandoRespaldo = true;
        return of(false);
      }),
    );
  }

  cambiarMoneda(codigo: string): void {
    const moneda = this.monedas.find((m) => m.codigo === codigo);

    if (!moneda) {
      return;
    }

    this.monedaActual.set(moneda);
    localStorage.setItem(this.claveMoneda, codigo);
  }

  formatear(precioCOP: number): string {
    const moneda = this.monedaActual();
    const valor = precioCOP * moneda.tasa;

    const numero = valor.toLocaleString('es-CO', {
      minimumFractionDigits: moneda.decimales,
      maximumFractionDigits: moneda.decimales,
    });

    return moneda.simbolo + ' ' + numero;
  }

  aCOP(valor: number | null): number | null {
    if (valor == null || isNaN(valor)) {
      return null;
    }

    return Math.round(valor / this.monedaActual().tasa);
  }

  deCOP(valorCOP: number | null): number | null {
    if (valorCOP == null) {
      return null;
    }

    const moneda = this.monedaActual();
    const factor = Math.pow(10, moneda.decimales);

    return Math.round(valorCOP * moneda.tasa * factor) / factor;
  }

  private refrescarMonedaActual(): void {
    const actual = this.monedas.find((m) => m.codigo === this.monedaActual().codigo);

    if (actual) {
      this.monedaActual.set({ ...actual });
    }
  }
}

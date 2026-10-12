import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Clima, RespuestaClima } from '../models/clima';

// Consulta el clima en la API Open-Meteo
@Injectable({ providedIn: 'root' })
export class ClimaService {
  private http = inject(HttpClient);
  private url = 'https://api.open-meteo.com/v1/forecast';

  // Clima actual + 3 dias
  getClima(latitud: number, longitud: number): Observable<Clima> {
    const params = {
      latitude: latitud,
      longitude: longitud,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: 4,
    };

    return this.http
      .get<RespuestaClima>(this.url, { params })
      .pipe(map((respuesta) => this.convertir(respuesta)));
  }

  // Respuesta de la API
  private convertir(respuesta: RespuestaClima): Clima {
    const actual = respuesta.current;
    const diario = respuesta.daily;
    const estado = this.describir(actual.weather_code);

    // Posicion 0 es hoy
    const dias = diario.time.slice(1).map((fecha, i) => ({
      fecha,
      nombre: this.nombreDia(fecha, i),
      icono: this.describir(diario.weather_code[i + 1]).icono,
      maxima: Math.round(diario.temperature_2m_max[i + 1]),
      minima: Math.round(diario.temperature_2m_min[i + 1]),
      lluvia: diario.precipitation_probability_max[i + 1] ?? 0,
    }));

    return {
      temperatura: Math.round(actual.temperature_2m),
      sensacion: Math.round(actual.apparent_temperature),
      humedad: actual.relative_humidity_2m,
      viento: Math.round(actual.wind_speed_10m),
      descripcion: estado.descripcion,
      icono: estado.icono,
      dias,
    };
  }

  // Codigo del clima, texto e iconos
  private describir(codigo: number): { descripcion: string; icono: string } {
    if (codigo === 0) return { descripcion: 'Despejado', icono: 'bi-sun' };
    if (codigo === 1) return { descripcion: 'Mayormente despejado', icono: 'bi-cloud-sun' };
    if (codigo === 2) return { descripcion: 'Parcialmente nublado', icono: 'bi-cloud-sun' };
    if (codigo === 3) return { descripcion: 'Nublado', icono: 'bi-cloud' };
    if (codigo <= 48) return { descripcion: 'Niebla', icono: 'bi-cloud-fog2' };
    if (codigo <= 57) return { descripcion: 'Llovizna', icono: 'bi-cloud-drizzle' };
    if (codigo <= 67) return { descripcion: 'Lluvia', icono: 'bi-cloud-rain' };
    if (codigo <= 77) return { descripcion: 'Nieve', icono: 'bi-cloud-snow' };
    if (codigo <= 82) return { descripcion: 'Aguaceros', icono: 'bi-cloud-rain-heavy' };
    if (codigo <= 86) return { descripcion: 'Nieve', icono: 'bi-cloud-snow' };
    return { descripcion: 'Tormenta', icono: 'bi-cloud-lightning-rain' };
  }

  private nombreDia(fecha: string, posicion: number): string {
    if (posicion === 0) return 'Mañana';
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const texto = new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', { weekday: 'short' });
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace('.', '');
  }
}

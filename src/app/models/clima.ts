// Respuesta de la API Open-Meteo

export interface RespuestaClima {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

// Clima de un dia del pronostico
export interface DiaClima {
  fecha: string;
  nombre: string;
  icono: string;
  maxima: number;
  minima: number;
  lluvia: number;
}

// Clima listo para mostrar
export interface Clima {
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  descripcion: string;
  icono: string;
  dias: DiaClima[];
}

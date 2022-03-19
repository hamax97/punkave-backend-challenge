export interface WeatherDto {
  date: Date;
  name: string;
  summary: { main: string; description: string };
  main: { temp: number; feelsLike: number; humidity: number };
  clouds: { all: number };
  snow: { '1h': number; '3h': number };
  rain: { '1h': number; '3h': number };
}

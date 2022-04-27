import { Controller, Get, HttpException, Query } from '@nestjs/common';

import { StationsService } from './stations.service';
import { parseDate } from 'src/utils/utils';
import { WeatherService } from 'src/weather/weather.service';

@Controller('api/v1/stations')
export class StationsController {
  constructor(
    private readonly stationsService: StationsService,
    private readonly weatherService: WeatherService,
  ) {}

  @Get()
  async allStations(@Query('at') at: string) {
    const atDateTime = parseDate(at);

    const weather = await this.weatherService.getDBWeatherInfo(atDateTime);
    const stations = await this.stationsService.getDBStationsInfo(atDateTime);

    if (!weather && stations.length === 0) {
      throw new HttpException(`Couldn't find information for date: ${at}`, 404);
    }

    return {
      at: stations[0].date.toISOString(),
      weather: weather,
      stations: stations,
    };
  }

  @Get(':kioskId')
  async station() {
    return '';
  }
}

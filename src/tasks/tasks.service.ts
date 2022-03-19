import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StationsService } from 'src/stations/stations.service';
import { StationDto } from 'src/stations/station.dto';
import { WeatherService } from 'src/weather/weather.service';
import { WeatherDto } from 'src/weather/weather.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly stationsService: StationsService,
    private readonly weatherService: WeatherService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateStationsAndWeatherInfo() {
    this.logger.log('Updating stations and weather info');

    const currentDate = new Date();

    // TODO: Consider using Promise.all
    // await this.updateStationsInfo(currentDate);
    await this.updateWeatherInfo(currentDate);
  }

  async updateStationsInfo(date: Date) {
    const stations = await this.stationsService.getStationsInfo();

    const processedStations = stations.map((station) =>
      this.filterStationObject(station, date),
    );

    return this.stationsService.storeStationsInfo(processedStations);
  }

  filterStationObject(station: StationDto, date: Date) {
    const newStation = { date: date };

    const neededFields = [
      'kioskId',
      'name',
      'totalDocks',
      'docksAvailable',
      'bikesAvailable',
      'addressStreet',
      'addressCity',
      'addressState',
      'addressZipCode',
      'latitude',
      'longitude',
    ];

    for (const field of neededFields) {
      newStation[field] = station[field];
    }

    return newStation as StationDto;
  }

  async updateWeatherInfo(date: Date) {
    const weatherInfo = await this.weatherService.getWeatherInfo();
    console.log(weatherInfo);
  }

  filterWeatherObject(weatherInfo: WeatherDto, date: Date) {
    const newWeatherInfo = { date: date };

    // TODO: Continue here ... copy only the fields needed (look in the notes).
    // how to copy nested fields?
    const neededFields = [];
  }
}

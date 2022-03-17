import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StationsService } from 'src/stations/stations.service';
import { StationDto } from 'src/stations/station.dto';

@Injectable()
export class TasksService {
  constructor(private readonly stationsService: StationsService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const currentDate = new Date();

    // TODO: Consider using Promise.all
    await this.updateStationsInfo(currentDate);
    await this.updateWeatherInfo();
  }

  async updateStationsInfo(date: Date) {
    const stations = await this.stationsService.getStationsInfo();

    const processedStations = stations.map((station) =>
      this.copyStationObject(station),
    );

    console.log(processedStations[0]);
    this.stationsService.storeStationsInfo(date);
  }

  copyStationObject(station: StationDto) {
    const newStation = {};

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

    return newStation;
  }

  async updateWeatherInfo() {
    console.log('Implement updateWeatherInfo');
  }
}

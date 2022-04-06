import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StationsService } from 'src/stations/stations.service';
import { WeatherService } from 'src/weather/weather.service';
import { TimingService } from 'src/shared/timing.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly stationsService: StationsService,
    private readonly weatherService: WeatherService,
    private readonly timingService: TimingService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateStationsAndWeatherInfo() {
    this.logger.log('Updating stations and weather info');

    const currentDate = new Date();

    // TODO: Consider using Promise.all
    await this.timingService.measure(
      this.updateStationsInfo,
      this,
      currentDate,
    );
    await this.timingService.measure(this.updateWeatherInfo, this, currentDate);
  }

  async updateStationsInfo(date: Date) {
    const stations = await this.stationsService.getStationsInfo();

    const processedStations = stations.map((station) => ({
      date: date,
      ...station,
    }));

    return this.stationsService.storeStationsInfo(processedStations);
  }

  async updateWeatherInfo(date: Date) {
    const weatherInfo = await this.weatherService.getWeatherInfo();
    const newWeatherInfo = { date: date, ...weatherInfo };
    return this.weatherService.storeWeatherInfo(newWeatherInfo);
  }
}

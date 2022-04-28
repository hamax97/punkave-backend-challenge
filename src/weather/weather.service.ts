import axios from 'axios';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Weather, WeatherDocument } from './weather.schema';
import { WeatherDto } from './weather.dto';
import { handleAxiosError } from 'src/utils/http';
import { createQueryBy } from 'src/utils/utils';

@Injectable()
export class WeatherService {
  private readonly OPEN_WEATHER_MAP_API_URL: string;
  private readonly OPEN_WEATHER_MAP_API_KEY: string;
  private readonly philadelphiaLatitude = 39.952583;
  private readonly philadelphiaLongitude = -75.165222;

  constructor(
    @InjectModel(Weather.name)
    private readonly weatherModel: Model<WeatherDocument>,
    private readonly env: ConfigService,
    private readonly logger: Logger,
  ) {
    this.OPEN_WEATHER_MAP_API_URL = this.env.get('OPEN_WEATHER_MAP_API_URL');
    this.OPEN_WEATHER_MAP_API_KEY = this.env.get('OPEN_WEATHER_MAP_API_KEY');
  }

  async getAPIWeatherInfo() {
    try {
      const weatherInfo = await this.requestWeatherInfo();

      if (!weatherInfo || Object.keys(weatherInfo).length === 0) {
        throw new Error("Couldn't find weather info");
      }

      return weatherInfo as WeatherDto;
    } catch (err) {
      this.logger.error(`Couldn't get weather information: ${err}`);
    }
  }

  private async requestWeatherInfo() {
    try {
      const res = await axios.get('/data/2.5/weather', {
        baseURL: this.OPEN_WEATHER_MAP_API_URL,
        params: {
          lat: this.philadelphiaLatitude,
          lon: this.philadelphiaLongitude,
          appid: this.OPEN_WEATHER_MAP_API_KEY,
          units: 'metric',
        },
      });

      return res.data as any;
    } catch (err) {
      handleAxiosError(err, this.OPEN_WEATHER_MAP_API_URL);
    }
  }

  async storeWeatherInfo(weatherInfo: WeatherDto) {
    const weather = new this.weatherModel(weatherInfo);
    return weather.save();
  }

  async getDBWeatherInfo(atDateTime: Date) {
    const weather = await this.weatherModel.findOne(createQueryBy(atDateTime), {
      _id: 0,
      __v: 0,
    });

    if (!weather) {
      this.logger.warn(
        `Couldn't get weather information from DB for date: ${atDateTime.toISOString()}`,
      );
    }

    return weather;
  }
}

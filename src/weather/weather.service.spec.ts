import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { WeatherService } from 'src/weather/weather.service';
import { Weather, WeatherDocument } from 'src/weather/weather.schema';
import { WeatherDto } from './weather.dto';

jest.mock('axios');

describe('weather service', () => {
  let weatherService: WeatherService;
  let mockWeatherModel: Model<WeatherDocument>;
  let mockWeatherModelSave;
  let mockConfigService: ConfigService;
  let mockLogger: Logger;
  const openWeatherAPIURLEnv = 'OPEN_WEATHER_MAP_API_URL';
  const openWeatherAPIKeyEnv = 'OPEN_WEATHER_MAP_API_KEY';
  const philadelphiaLatitude = 39.952583;
  const philadelphiaLongitude = -75.165222;

  beforeEach(async () => {
    const weatherModelToken = getModelToken(Weather.name);
    mockWeatherModelSave = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: weatherModelToken,
          useValue: jest.fn().mockImplementation(() => ({
            save: mockWeatherModelSave,
          })),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((envVar: string) => envVar),
          },
        },
        {
          provide: Logger,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    weatherService = moduleRef.get(WeatherService);
    mockWeatherModel = moduleRef.get(weatherModelToken);
    mockConfigService = moduleRef.get(ConfigService);
    mockLogger = moduleRef.get(Logger);
  });

  test('needed providers injected', () => {
    expect(weatherService).toHaveProperty('weatherModel');
    expect(weatherService).toHaveProperty('env');
    expect(weatherService).toHaveProperty('logger');
  });

  test('service constructed properly', () => {
    expect(mockConfigService.get).toHaveBeenCalledTimes(2);
    expect(mockConfigService.get).toHaveBeenCalledWith(openWeatherAPIURLEnv);
    expect(weatherService).toHaveProperty('OPEN_WEATHER_MAP_API_URL');

    expect(mockConfigService.get).toHaveBeenCalledWith(openWeatherAPIKeyEnv);
    expect(weatherService).toHaveProperty('OPEN_WEATHER_MAP_API_KEY');
  });

  describe('getWeatherInfo', () => {
    test('retrieves weather info from open weather API', async () => {
      const mockWeatherInfo = {
        data: {
          name: 'Some weather name X',
        },
      };

      axios.get = jest.fn().mockResolvedValue(mockWeatherInfo);

      const apiPath = '/data/2.5/weather';
      const apiUrl = mockConfigService.get(openWeatherAPIURLEnv);

      const result = await weatherService.getAPIWeatherInfo();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(apiPath, {
        baseURL: apiUrl,
        params: {
          lat: philadelphiaLatitude,
          lon: philadelphiaLongitude,
          appid: openWeatherAPIKeyEnv,
          units: 'metric',
        },
      });

      expect(result).toStrictEqual(mockWeatherInfo.data);
    });

    test('throws if empty response from API', async () => {
      const err = new Error("Couldn't find weather info");

      const mockWeatherInfo = {
        data: {},
      };

      axios.get = jest.fn().mockResolvedValue(mockWeatherInfo);

      await weatherService.getAPIWeatherInfo();

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Couldn't get weather information: ${err}`,
      );
    });
  });

  test('storeWeatherInfo', async () => {
    const mockWeatherInfo = { name: 'Some weather object' } as WeatherDto;
    weatherService.storeWeatherInfo(mockWeatherInfo);
    expect(mockWeatherModel).toHaveBeenCalledTimes(1);
    expect(mockWeatherModel).toHaveBeenCalledWith(mockWeatherInfo);

    expect(mockWeatherModelSave).toHaveBeenCalledTimes(1);
  });

  test.todo('getDBWeatherInfo');
  test.todo('getDBRangeWeatherInfo');
});

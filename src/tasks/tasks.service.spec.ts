import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { StationsService } from 'src/stations/stations.service';
import { WeatherService } from 'src/weather/weather.service';
import { TimingService } from 'src/shared/timing.service';

describe('tasks service', () => {
  let tasksService: TasksService;
  let mockStationsService: StationsService;
  let mockWeatherService: WeatherService;
  let mockTimingService: TimingService;
  let mockLogger: Logger;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: StationsService,
          useValue: {
            getStationsInfo: jest.fn(),
            storeStationsInfo: jest.fn(),
          },
        },
        {
          provide: WeatherService,
          useValue: {
            getWeatherInfo: jest.fn(),
            storeWeatherInfo: jest.fn(),
          },
        },
        {
          provide: TimingService,
          useValue: {
            measure: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = moduleRef.get(TasksService);
    mockStationsService = moduleRef.get(StationsService);
    mockWeatherService = moduleRef.get(WeatherService);
    mockTimingService = moduleRef.get(TimingService);
    mockLogger = moduleRef.get(Logger);
  });

  test.todo('updateStationsAndWeatherInfo');
  test.todo('updateStationsInfo');
  test.todo('updateWeatherInfo');
});

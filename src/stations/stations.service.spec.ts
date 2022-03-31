import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StationsService } from './stations.service';
import { Station, StationDocument } from './station.schema';

describe('stations service', () => {
  let stationsService: StationsService;
  let mockStationModel: Model<StationDocument>;
  let mockConfigService: ConfigService;
  let mockLogger: Logger;

  beforeEach(async () => {
    const stationModelToken = getModelToken(Station.name);

    const moduleRef = await Test.createTestingModule({
      providers: [
        StationsService,
        {
          provide: stationModelToken,
          useValue: { fake: 'object' },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((envVar: string) => envVar),
          },
        },
        {
          provide: Logger,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    stationsService = moduleRef.get(StationsService);
    mockStationModel = moduleRef.get(stationModelToken);
    mockConfigService = moduleRef.get(ConfigService);
    mockLogger = moduleRef.get(Logger);
  });

  test('needed providers injected', () => {
    expect(stationsService).toHaveProperty('stationModel');
    expect(stationsService).toHaveProperty('env');
    expect(stationsService).toHaveProperty('logger');
  });

  test('service constructed properly', () => {
    expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    expect(mockConfigService.get).toHaveBeenCalledWith('INDEGO_API_URL');
    expect(stationsService).toHaveProperty('INDEGO_API_URL');
  });

  describe('getStationsInfo', () => {
    // TODO: Continue here ...
    // - consider using the nestsjs/axios module instead of axios directly.
    // https://docs.nestjs.com/techniques/http-module
    test.todo('');
  });

  test.todo('create station');
});

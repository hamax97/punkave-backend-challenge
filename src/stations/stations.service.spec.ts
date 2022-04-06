import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { StationsService } from './stations.service';
import { Station, StationDocument } from './station.schema';

jest.mock('axios');

describe('stations service', () => {
  let stationsService: StationsService;
  let mockStationModel: Model<StationDocument>;
  let mockConfigService: ConfigService;
  let mockLogger: Logger;
  let mockIndegoAPIURLEnv: string;

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
          useValue: { log: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    stationsService = moduleRef.get(StationsService);
    mockStationModel = moduleRef.get(stationModelToken);
    mockConfigService = moduleRef.get(ConfigService);
    mockLogger = moduleRef.get(Logger);
    mockIndegoAPIURLEnv = 'INDEGO_API_URL';
  });

  test('needed providers injected', () => {
    expect(stationsService).toHaveProperty('stationModel');
    expect(stationsService).toHaveProperty('env');
    expect(stationsService).toHaveProperty('logger');
  });

  test('service constructed properly', () => {
    expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    expect(mockConfigService.get).toHaveBeenCalledWith(mockIndegoAPIURLEnv);
    expect(stationsService).toHaveProperty('INDEGO_API_URL');
  });

  describe('getStationsInfo', () => {
    test('retrieves stations from indego API', async () => {
      const mockStations = {
        data: {
          features: [{ properties: { name: '3rd St. Station' } }],
        },
      };

      axios.get = jest.fn().mockResolvedValue(mockStations);
      const apiURL = mockConfigService.get(mockIndegoAPIURLEnv);

      const result = await stationsService.getStationsInfo();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(apiURL);
      expect(result).toStrictEqual(
        mockStations.data.features.map((station) => station.properties),
      );
    });

    test('throws if empty response from API', async () => {
      let mockStations = {
        data: {},
      };
      let mockErr = "Couldn't find any station";

      axios.get = jest.fn().mockResolvedValue(mockStations);

      await stationsService.getStationsInfo();

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Couldn't get stations information: Error: ${mockErr}`,
      );

      mockStations = {
        data: { features: [] },
      };

      axios.get = jest.fn().mockResolvedValue(mockStations);

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Couldn't get stations information: Error: ${mockErr}`,
      );
    });
  });

  test.todo('create station');
});

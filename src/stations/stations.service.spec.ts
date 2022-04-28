import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import axios from 'axios';

import { StationsService } from './stations.service';
import { Station } from './station.schema';
import { StationDto } from './station.dto';

jest.mock('axios');

describe('stations service', () => {
  let stationsService: StationsService;
  let mockStationModelInsertMany;
  let mockConfigService: ConfigService;
  let mockLogger: Logger;
  let mockIndegoAPIURLEnv: string;

  beforeEach(async () => {
    mockStationModelInsertMany = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        StationsService,
        {
          provide: getModelToken(Station.name),
          useValue: {
            insertMany: mockStationModelInsertMany,
          },
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

  describe('getAPIStationsInfo', () => {
    test('retrieves stations from indego API', async () => {
      const mockStations = {
        data: {
          features: [{ properties: { name: '3rd St. Station' } }],
        },
      };

      axios.get = jest.fn().mockResolvedValue(mockStations);
      const apiURL = mockConfigService.get(mockIndegoAPIURLEnv);

      const result = await stationsService.getAPIStationsInfo();

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
      const mockErr = "Couldn't find any station";

      axios.get = jest.fn().mockResolvedValue(mockStations);

      await stationsService.getAPIStationsInfo();

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Couldn't get stations information from API: Error: ${mockErr}`,
      );

      mockStations = {
        data: { features: [] },
      };

      axios.get = jest.fn().mockResolvedValue(mockStations);

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Couldn't get stations information from API: Error: ${mockErr}`,
      );
    });
  });

  test('storeStationsInfo', async () => {
    const mockStationsInfo = [
      { name: '3rd St. Station' },
      { name: '2nd St. Station' },
    ] as StationDto[];
    await stationsService.storeStationsInfo(mockStationsInfo);

    expect(mockStationModelInsertMany).toHaveBeenCalledTimes(1);
    expect(mockStationModelInsertMany).toHaveBeenCalledWith(mockStationsInfo);
  });

  test.todo('getDBStationsInfo');
  test.todo('getDBStationInfo');
  test.todo('getDBRangeStationInfo');
});

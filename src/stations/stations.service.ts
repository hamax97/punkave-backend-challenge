import axios from 'axios';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Station, StationDocument } from './station.schema';
import { StationDto } from './station.dto';
import { handleAxiosError } from 'src/utils/http';

@Injectable()
export class StationsService {
  private readonly INDEGO_API_URL: string;
  private readonly logger = new Logger(StationsService.name);

  constructor(
    @InjectModel(Station.name)
    private readonly stationModel: Model<StationDocument>,
    private readonly env: ConfigService,
  ) {
    this.INDEGO_API_URL = this.env.get('INDEGO_API_URL');
  }

  async create() {
    const createdStation = new this.stationModel({ name: 'Some cool name' });
    await createdStation.save();
  }

  async getStationsInfo() {
    try {
      const stationsInfo = await this.requestStationsInfo();

      if (!stationsInfo) {
        throw new Error("Couldn't find any station");
      }

      return stationsInfo.map(
        (stationInfo) => stationInfo.properties as StationDto,
      );
    } catch (err) {
      this.logger.error(`Couldn't get stations information: ${err}`);
    }
  }

  private async requestStationsInfo() {
    try {
      const res = await axios.get(this.INDEGO_API_URL);
      return res.data?.features as any[];
    } catch (err) {
      handleAxiosError(err, this.INDEGO_API_URL);
    }
  }

  async storeStationsInfo(stationsInfo: StationDto[]) {
    return this.stationModel.insertMany(stationsInfo);
  }
}

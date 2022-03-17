import { Model } from 'mongoose';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Station, StationDocument } from './station.schema';
import { StationDto } from './station.dto';

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
      if (err.response) {
        const serverResponse = err.response;
        throw new Error(
          `${this.INDEGO_API_URL} responded with: ${serverResponse.status} - ${serverResponse.data}`,
        );
      } else if (err.request) {
        throw new Error(`${this.INDEGO_API_URL} failed to respond`);
      } else {
        throw new Error(
          `Couldn't make request to ${this.INDEGO_API_URL}: ${err}`,
        );
      }
    }
  }

  async storeStationsInfo(date: Date) {
    console.log(`Doing bulk insert for date: ${date}`);
  }
}

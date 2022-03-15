import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Station, StationDocument } from './station.schema';

@Injectable()
export class StationsService {
  constructor(
    @InjectModel(Station.name)
    private readonly stationModel: Model<StationDocument>,
  ) {}

  async create() {
    const createdStation = new this.stationModel({name: 'Some cool name'});
    await createdStation.save();
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StationsService } from './stations.service';
import { Station, StationSchema } from './station.schema';
import { StationsController } from './stations.controller';

const modelDefinitions = [{ name: Station.name, schema: StationSchema }];

@Module({
  imports: [MongooseModule.forFeature(modelDefinitions)],
  providers: [StationsService],
  controllers: [StationsController]
})
export class StationsModule {}

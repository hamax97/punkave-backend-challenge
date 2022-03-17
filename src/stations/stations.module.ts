import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { StationsService } from './stations.service';
import { Station, StationSchema } from './station.schema';
import { StationsController } from './stations.controller';

const modelDefinitions = [{ name: Station.name, schema: StationSchema }];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(modelDefinitions),
  ],
  providers: [StationsService],
  controllers: [StationsController],
  exports: [StationsService],
})
export class StationsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { WeatherService } from './weather.service';
import { Weather, WeatherSchema } from './weather.schema';

const modelDefinitions = [{ name: Weather.name, schema: WeatherSchema }];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(modelDefinitions),
  ],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}

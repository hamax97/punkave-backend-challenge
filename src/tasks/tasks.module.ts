import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TasksService } from './tasks.service';
import { StationsModule } from 'src/stations/stations.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [StationsModule, WeatherModule, ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}

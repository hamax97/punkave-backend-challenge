import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TasksService } from './tasks.service';
import { StationsModule } from 'src/stations/stations.module';

@Module({
  imports: [StationsModule, ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}

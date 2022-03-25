import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { StationsModule } from './stations/stations.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    DatabaseModule,
    StationsModule,
    TasksModule,
  ],
})
export class AppModule {}

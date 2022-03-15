import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { StationsModule } from './stations/stations.module';

@Module({
  imports: [DatabaseModule, StationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

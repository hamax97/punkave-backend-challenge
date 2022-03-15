import { Controller, Get } from '@nestjs/common';

import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  async create() {
    console.log("hre");
    await this.stationsService.create(); // Should i use this last await?
  }
}

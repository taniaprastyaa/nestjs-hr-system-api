import { Module } from '@nestjs/common';
import { JobPositionController } from './job_position.controller';
import { JobPositionService } from './job_position.service';

@Module({
  controllers: [JobPositionController],
  providers: [JobPositionService]
})
export class JobPositionModule {}

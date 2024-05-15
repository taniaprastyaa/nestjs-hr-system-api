import { Module } from '@nestjs/common';
import { HodOvertimeController } from './hod_overtime.controller';
import { HodOvertimeService } from './hod_overtime.service';

@Module({
  controllers: [HodOvertimeController],
  providers: [HodOvertimeService]
})
export class HodOvertimeModule {}

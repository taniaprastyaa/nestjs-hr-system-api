import { Module } from '@nestjs/common';
import { WorkShiftController } from './work_shift.controller';
import { WorkShiftService } from './work_shift.service';

@Module({
  controllers: [WorkShiftController],
  providers: [WorkShiftService]
})
export class WorkShiftModule {}

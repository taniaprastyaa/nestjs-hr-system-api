import { Module } from '@nestjs/common';
import { HodAttendanceController } from './hod_attendance.controller';
import { HodAttendanceService } from './hod_attendance.service';

@Module({
  controllers: [HodAttendanceController],
  providers: [HodAttendanceService]
})
export class HodAttendanceModule {}

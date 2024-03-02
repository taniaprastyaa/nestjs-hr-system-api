import { Module } from '@nestjs/common';
import { EmployeeWorkShiftController } from './employee_work_shift.controller';
import { EmployeeWorkShiftService } from './employee_work_shift.service';

@Module({
  controllers: [EmployeeWorkShiftController],
  providers: [EmployeeWorkShiftService]
})
export class EmployeeWorkShiftModule {}

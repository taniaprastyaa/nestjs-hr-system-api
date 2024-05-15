import { Module } from '@nestjs/common';
import { EmployeeOvertimeController } from './employee_overtime.controller';
import { EmployeeOvertimeService } from './employee_overtime.service';

@Module({
  controllers: [EmployeeOvertimeController],
  providers: [EmployeeOvertimeService]
})
export class EmployeeOvertimeModule {}

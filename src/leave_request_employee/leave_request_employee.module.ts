import { Module } from '@nestjs/common';
import { LeaveRequestEmployeeController } from './leave_request_employee.controller';
import { LeaveRequestEmployeeService } from './leave_request_employee.service';

@Module({
  controllers: [LeaveRequestEmployeeController],
  providers: [LeaveRequestEmployeeService]
})
export class LeaveRequestEmployeeModule {}

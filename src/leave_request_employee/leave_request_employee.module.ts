import { Module } from '@nestjs/common';
import { LeaveRequestController } from './leave_request_employee.controller';
import { LeaveRequestService } from './leave_request_employee.service';

@Module({
  controllers: [LeaveRequestController],
  providers: [LeaveRequestService]
})
export class LeaveRequestModule {}

import { Module } from '@nestjs/common';
import { LeaveRequestController } from './leave_request.controller';
import { LeaveRequestService } from './leave_request.service';

@Module({
  controllers: [LeaveRequestController],
  providers: [LeaveRequestService]
})
export class LeaveRequestModule {}

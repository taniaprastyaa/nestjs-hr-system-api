import { Module } from '@nestjs/common';
import { LeaveRequestHodController } from './leave_request_hod.controller';
import { LeaveRequestHodService } from './leave_request_hod.service';

@Module({
  controllers: [LeaveRequestHodController],
  providers: [LeaveRequestHodService]
})
export class LeaveRequestHodModule {}

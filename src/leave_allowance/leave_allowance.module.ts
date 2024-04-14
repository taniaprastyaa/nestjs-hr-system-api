import { Module } from '@nestjs/common';
import { LeaveAllowanceController } from './leave_allowance.controller';
import { LeaveAllowanceService } from './leave_allowance.service';

@Module({
  controllers: [LeaveAllowanceController],
  providers: [LeaveAllowanceService]
})
export class LeaveAllowanceModule {}
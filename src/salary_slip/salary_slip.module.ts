import { Module } from '@nestjs/common';
import { SalarySlipController } from './salary_slip.controller';
import { SalarySlipService } from './salary_slip.service';

@Module({
  controllers: [SalarySlipController],
  providers: [SalarySlipService]
})
export class SalarySlipModule {}

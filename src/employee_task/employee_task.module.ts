import { Module } from '@nestjs/common';
import { EmployeeTaskController } from './employee_task.controller';
import { EmployeeTaskService } from './employee_task.service';

@Module({
  controllers: [EmployeeTaskController],
  providers: [EmployeeTaskService]
})
export class EmployeeTaskModule {}

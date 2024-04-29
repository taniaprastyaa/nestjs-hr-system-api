import { Module } from '@nestjs/common';
import { EmployeesOnAssignmentTempController } from './employees_on_assignment_temp.controller';
import { EmployeesOnAssignmentTempService } from './employees_on_assigment_temp.service';

@Module({
  controllers: [EmployeesOnAssignmentTempController],
  providers: [EmployeesOnAssignmentTempService]
})
export class EmployeesOnAssignmentTempModule {}

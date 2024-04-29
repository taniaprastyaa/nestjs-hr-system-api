import { Module } from '@nestjs/common';
import { EmployeesOnAssignmentController } from './employees_on_assignment.controller';
import { EmployeesOnAssignmentService } from './employees_on_assigment.service';

@Module({
  controllers: [EmployeesOnAssignmentController],
  providers: [EmployeesOnAssignmentService]
})
export class EmployeesOnAssignmentModule {}

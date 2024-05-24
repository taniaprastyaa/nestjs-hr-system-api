import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { EmployeeAttendanceModule } from './employee_attendance/employee_attendance.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeesOnAssignmentModule } from './employees_on_assignment/employees_on_assignment.module';
import { EmployeesOnAssignmentTempModule } from './employees_on_assignment_temp/employees_on_assignment_temp.module';
import { EmployeeTaskModule } from './employee_task/employee_task.module';
import { EmployeeWorkShiftModule } from './employee_work_shift/employee_work_shift.module';
import { JobPositionModule } from './job_position/job_position.module';
import { LeaveModule } from './leave/leave.module';
import { LeaveAllowanceModule } from './leave_allowance/leave_allowance.module';
import { LeaveRequestEmployeeModule } from './leave_request_employee/leave_request_employee.module';
import { LeaveRequestHodModule } from './leave_request_hod/leave_request_hod.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkShiftModule } from './work_shift/work_shift.module';
import { HodAttendanceModule } from './hod_attendance/hod_attendance.module';
import { EmployeeOvertimeModule } from './employee_overtime/employee_overtime.module';
import { HodOvertimeModule } from './hod_overtime/hod_overtime.module';
import { SalarySlipModule } from './salary_slip/salary_slip.module';
import { DepartmentDocumentModule } from './department_document/department_document.module';
import { LeaveRequestModule } from './leave_request/leave_request.module';
import { AttendanceModule } from './attendance/attendance.module';
import { OvertimeModule } from './overtime/overtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, 
    PrismaModule,
    DepartmentModule,
    JobPositionModule,
    LeaveModule,
    WorkShiftModule,
    AdminModule,
    EmployeeModule,
    EmployeeWorkShiftModule,
    AnnouncementModule,
    LeaveAllowanceModule,
    EmployeeTaskModule,
    EmployeesOnAssignmentTempModule,
    EmployeesOnAssignmentModule,
    LeaveRequestEmployeeModule,
    LeaveRequestHodModule,
    EmployeeAttendanceModule,
    HodAttendanceModule,
    EmployeeOvertimeModule,
    HodOvertimeModule,
    SalarySlipModule,
    DepartmentDocumentModule,
    LeaveRequestModule,
    AttendanceModule,
    OvertimeModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { JobPositionModule } from './job_position/job_position.module';
import { LeaveModule } from './leave/leave.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkShiftModule } from './work_shift/work_shift.module';

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
    EmployeeModule
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeWorkShiftModule } from './employee_work_shift/employee_work_shift.module';
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
    EmployeeModule,
    EmployeeWorkShiftModule,
    AnnouncementModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}

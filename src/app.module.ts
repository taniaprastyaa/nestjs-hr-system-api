import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { JobPositionModule } from './job_position/job_position.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, 
    PrismaModule,
    DepartmentModule,
    JobPositionModule
  ],
})
export class AppModule {}

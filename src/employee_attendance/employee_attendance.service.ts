import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttendanceStatus, Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeAttendanceDto } from './dto';

@Injectable()
export class EmployeeAttendanceService {
    logger: any;
    constructor(private prisma: PrismaService) {}

    // Get all attendances
    async getAllAttendance(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.employee.findMany({
            where: {
                user_id 
            }
        });

        const attendances = await this.prisma.attendance.findMany({
            where: {
                employee_id: employee[0].id
            },
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "Attendance fetched successfully",
            attendances
        );
    }

    // Get attendance by id
    async getAttendanceById(
        attendanceWhereUniqueInput: Prisma.AttendanceWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const attendance = await this.prisma.attendance.findUnique({
            where: attendanceWhereUniqueInput,
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "Attendance fetched successfully",
            attendance
        );
    }

    async createAttendance(dto: EmployeeAttendanceDto, user_id: number): Promise<ResponseFormatter> {
        try {
            const date = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            const employee = await this.prisma.employee.findMany({
                where: {
                    user_id
                },
            });

            const existingAttendance = await this.prisma.attendance.findFirst({
                where: {
                  date,
                  employee_id: employee[0].id,
                },
            });
          
            if (existingAttendance) {
                throw new BadRequestException("You've already filled in your attendance for today");
            }
            
            const workShift = await this.prisma.employeeWorkShift.findFirst({
                where: {
                    employee_id: employee[0].id
                },
                include: {
                    shift: true
                }
            });

            if (!workShift) {
                throw new BadRequestException("Employee work shift not found");
            }

            const startShiftTime = workShift["shift"]["start_time"];
            const delayMinutes = this.calculateDelay(currentTime, startShiftTime);

            const attendance = await this.prisma.attendance.create({
                data: {
                    ...dto,
                    employee_id: employee[0].id,
                    date,
                    time_in: currentTime,
                    time_out: currentTime,
                    delay_minutes: delayMinutes
                }
            });

            return ResponseFormatter.success(
                "Attendance created successfully",
                attendance,
                201
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }
    
            throw new InternalServerErrorException('Attendance failed to create');
        }
    }

    calculateDelay(currentTime: string, startShiftTime: string): number {
        // Assuming currentTime and startShiftTime are in format "HH:mm"
        const currentTimeParts = currentTime.split(':').map(part => parseInt(part, 10));
        const startShiftTimeParts = startShiftTime.split(':').map(part => parseInt(part, 10));

        const currentTotalMinutes = currentTimeParts[0] * 60 + currentTimeParts[1];
        const startShiftTotalMinutes = startShiftTimeParts[0] * 60 + startShiftTimeParts[1];

        const delayMinutes = Math.max(currentTotalMinutes - startShiftTotalMinutes, 0);

        return delayMinutes;
    }
}

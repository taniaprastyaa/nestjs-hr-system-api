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
        });

        return ResponseFormatter.success(
            "Attendance fetched successfully",
            attendance
        );
    }

    // Store attendance to database
    async createAttendance(dto: EmployeeAttendanceDto, user_id: number) : Promise<ResponseFormatter> {
        try {
            const date = new Date().toISOString().split('T')[0];

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
            
            const attendance = await this.prisma.attendance.create({
                data: {
                    ...dto,
                    employee_id: employee[0].id,
                    date
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
}

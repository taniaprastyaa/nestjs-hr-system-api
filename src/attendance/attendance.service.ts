import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttendanceStatus, Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
    private readonly logger = new Logger(AttendanceService.name);
    constructor(private prisma: PrismaService) {}

    // Get all attendances
    async getAllAttendance() : Promise<ResponseFormatter> {
        const attendances = await this.prisma.attendance.findMany();

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
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttendanceStatus, Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HodAttendanceService {
    logger: any;
    constructor(private prisma: PrismaService) {}

    // Get all attendances
    async getAllAttendance(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.employee.findMany({
            where: {
                user_id 
            },
            include: {
                department: true
            }
        });

        const department = employee[0]["department"]["department_name"];

        const attendances = await this.prisma.attendance.findMany({
            where: {
                employee: {
                  department: {
                    department_name: department
                  }
                }
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

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkMissingAttendance(user_id: number): Promise<void> {
      // Mendapatkan tanggal hari ini
      const todayDate = new Date().toISOString().split('T')[0];

      const employee = await this.prisma.employee.findMany({
        where: {
            user_id 
        },
        include: {
            department: true
        }
    });

    const department = employee[0]["department"]["department_name"];
  
      // Mendapatkan semua employee
      const employees = await this.prisma.employee.findMany({
        where: {
            department: {
                department_name: department
            }
        }
      });
  
      // Loop melalui setiap employee dan cek apakah mereka sudah mengisi kehadiran hari ini
      for (const employee of employees) {
        const existingAttendance = await this.prisma.attendance.findFirst({
          where: {
            date: todayDate,
            employee_id: employee.id,
          },
        });
  
        // Jika karyawan belum mengisi kehadiran, tandai sebagai 'Absen'
        if (!existingAttendance) {
          await this.prisma.attendance.create({
            data: {
              date: todayDate,
              status: AttendanceStatus.Absent,
              employee: { connect: { id: employee.id } },
            },
          });
        }
      }
    }
}

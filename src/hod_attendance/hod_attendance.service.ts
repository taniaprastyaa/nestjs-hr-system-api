import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttendanceStatus, Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAttendanceDto } from './dto';

@Injectable()
export class HodAttendanceService {
    private readonly logger = new Logger(HodAttendanceService.name);
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

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkMissingAttendance(user_id: number): Promise<void> {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayISOString = yesterdayDate.toISOString().split('T')[0];

      const employee = await this.prisma.employee.findMany({
        where: {
            user_id 
        },
        include: {
            department: true
        }
    });

    const department = employee[0]["department"]["department_name"];
  
    const employees = await this.prisma.employee.findMany({
      where: {
        department: {
          department_name: department
        }
      },
    });
  
      for (const employee of employees) {
        const existingAttendance = await this.prisma.attendance.findFirst({
          where: {
            date: yesterdayISOString,
            employee_id: employee.id,
          },
          include: {
            employee: true
          }
        });
  
        if (!existingAttendance) {
          await this.prisma.attendance.create({
            data: {
              date: yesterdayISOString,
              status: AttendanceStatus.Absent,
              employee: { connect: { id: employee.id } },
              delay_minutes: null
            },
          });
        }
      }
    }

  // Update attendance in database
  async updateAttendance(params: {
      where: Prisma.AttendanceWhereUniqueInput;
      dto: UpdateAttendanceDto;
  }) : Promise<ResponseFormatter> {
      try {
          const {where, dto} = params;
          const workShift = await this.prisma.employeeWorkShift.findFirst({
            where: {
                employee_id: dto.employee_id
            },
            include: {
                employee: true,
                shift: true
            }
        });
        const startShiftTime = workShift["shift"]["start_time"];
        const delayMinutes = this.calculateDelay(dto.time_in, startShiftTime);
        const attendance = await this.prisma.attendance.update({
              where,
              data: {
                ...dto,
               delay_minutes: delayMinutes
              },
              include: {
                employee: true
              }
          });

          return ResponseFormatter.success(
              "Attendance updated successfully",
              attendance
          );
      } catch (err) {
        this.logger.error(`Error updating attendance: ${err.message}`, err.stack);
          if(err.code === 'P2002') {
              throw new BadRequestException('Attendance already exist');
          }

          throw new InternalServerErrorException('Attendance failed to update');
      }
  }

  // Delete attendance in database
  async deleteAttendance(where: Prisma.AttendanceWhereUniqueInput) : Promise<ResponseFormatter> {
      try {
          const attendance = await this.prisma.attendance.delete({
              where,
              include: {
                employee: true
              }
          });

          return ResponseFormatter.success(
              "Attendance deleted successfully",
              attendance
          );
      } catch (err) {
          throw new InternalServerErrorException('Attendance failed to delete');
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

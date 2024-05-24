import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveRequestHodDto } from './dto';

@Injectable()
export class LeaveRequestHodService {
    constructor(private prisma: PrismaService) {}

    // Get all leaveRequests
    async getAllLeaveRequest(department: string) : Promise<ResponseFormatter> {
        const leaveRequests = await this.prisma.leaveRequest.findMany({
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
            "Leave request fetched successfully",
            leaveRequests
        );
    }

    // Get employee by user id
    async getEmployeeByUserId(
        user_id: number
    ) : Promise<ResponseFormatter> {
        const employee = await this.prisma.employee.findMany({
            where: {
                user_id
            },
            include: {
                department: true
            }
        });

        return employee;
    }

    // Get leaveRequest by id
    async getLeaveRequestById(
        leaveRequestWhereUniqueInput: Prisma.LeaveRequestWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const leaveRequest = await this.prisma.leaveRequest.findUnique({
            where: leaveRequestWhereUniqueInput,
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "Leave request fetched successfully",
            leaveRequest
        );
    }

    // Update leaveRequest in database
    async updateLeaveRequest(
        where: Prisma.LeaveRequestWhereUniqueInput,
        dto: LeaveRequestHodDto
    ) : Promise<ResponseFormatter> {
        try {
            const leaveRequest = await this.prisma.leaveRequest.update({
                where,
                data: {
                    ...dto,
                }
            });

            if(leaveRequest && (leaveRequest.status === "Approved")){
                const leaveAllowance =  await this.prisma.leaveAllowance.findUnique({
                    where: {
                        employee_id: leaveRequest.employee_id
                    }
                });

                const leave = await this.prisma.leave.findUnique({
                    where: {
                        id: leaveRequest.leave_id
                    },
                });

                const leaveAllowanceTotal = leaveAllowance.leave_allowances - (leaveRequest.long_leave * leave.value);

                await this.prisma.leaveAllowance.update({
                    where: {
                        employee_id: leaveRequest.employee_id
                    },
                    data: {
                        leave_allowances: leaveAllowanceTotal
                    }
                });

                // Hitung jumlah hari dalam rentang tanggal (start_date - end_date)
                const startDate = new Date(leaveRequest.start_date);
                const endDate = new Date(leaveRequest.end_date);
                const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

                // Lakukan iterasi untuk setiap hari dalam rentang tanggal
                for (let i = 0; i <= daysDifference; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(currentDate.getDate() + i);

                    // Periksa apakah karyawan sudah memiliki catatan kehadiran untuk tanggal tersebut
                    const existingAttendance = await this.prisma.attendance.findFirst({
                        where: {
                        date: currentDate.toISOString().split('T')[0],
                        employee_id: leaveRequest.employee_id,
                        },
                    });

                    const leaveStatus = leave.value === 1 ? 'Leave' : 'Half_day_leave';
                    if (!existingAttendance) {
                        await this.prisma.attendance.create({
                        data: {
                            date: currentDate.toISOString().split('T')[0],
                            status: leaveStatus,
                            employee: { connect: { id: leaveRequest.employee_id } },
                        },
                        });
                    } else {
                        await this.prisma.attendance.update({
                        where: { id: existingAttendance.id },
                        data: { status: leaveStatus },
                        });
                    }
                }
            }

            return ResponseFormatter.success(
                "Leave request updated successfully",
                leaveRequest
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            throw new InternalServerErrorException('Leave request failed to update');
        }
    }
}

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

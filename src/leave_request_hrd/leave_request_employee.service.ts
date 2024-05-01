import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveRequestDto } from './dto';

@Injectable()
export class LeaveRequestService {
    constructor(private prisma: PrismaService) {}

    // Get all leaveRequests
    async getAllLeaveRequest(employee_id: number) : Promise<ResponseFormatter> {
        const leaveRequests = await this.prisma.leaveRequest.findMany({
            where:{
                employee_id
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

    // Store leaveRequest to database
    async createLeaveRequest(dto: LeaveRequestDto, employee_id: number) : Promise<ResponseFormatter> {
        try {
            const start_date = new Date(dto.start_date);
            const end_date = new Date(dto.end_date);
            const longLeave = this.calculateLeaveDays(start_date, end_date)
            const leaveRequest = await this.prisma.leaveRequest.create({
                data: {
                    ...dto,
                    long_leave: longLeave,
                    status: "Pending",
                    employee_id: employee_id
                }
            });

            return ResponseFormatter.success(
                "Leave request created successfully",
                leaveRequest,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('LeaveRequest already exist');
            }
    
            throw new InternalServerErrorException('Leave request failed to create');
        }
    } 

    // Update leaveRequest in database
    async updateLeaveRequest(
        where: Prisma.LeaveRequestWhereUniqueInput,
        dto: LeaveRequestDto
    ) : Promise<ResponseFormatter> {
        try {

            const start_date = new Date(dto.start_date);
            const end_date = new Date(dto.end_date);
            const longLeave = this.calculateLeaveDays(start_date, end_date);

            const leaveRequestById = await this.getLeaveRequestById(where);

            if(leaveRequestById["data"]["status"] !== "Pending"){
                throw new BadRequestException("Leave request has already been processed and cannot be edited.");
            }

            const leaveRequest = await this.prisma.leaveRequest.update({
                where,
                data: {
                        ...dto,
                        long_leave: longLeave
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

    // Delete leaveRequest in database
    async deleteLeaveRequest(where: Prisma.LeaveRequestWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const leaveRequestById = await this.getLeaveRequestById(where);

            if(leaveRequestById["data"]["status"] !== "Pending"){
                throw new BadRequestException("Leave request has already been processed and cannot be edited.");
            }

            const leaveRequest = await this.prisma.leaveRequest.delete({
                where,
            });

            return ResponseFormatter.success(
                "Leave request deleted successfully",
                leaveRequest
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            throw new InternalServerErrorException('Leave request failed to delete');
        }
    }

    calculateLeaveDays(start_date: Date, end_date: Date): number {
        const diffTime = Math.abs(end_date.getTime() - start_date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          return 1;
        }
        
        return diffDays + 1;
      }
}

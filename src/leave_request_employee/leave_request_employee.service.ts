import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveRequestEmployeeDto } from './dto';

@Injectable()
export class LeaveRequestEmployeeService {
    constructor(private prisma: PrismaService) {}

    // Get all leaveRequestEmployees
    async getAllLeaveRequestEmployee(employee_id: number) : Promise<ResponseFormatter> {
        const leaveRequestEmployees = await this.prisma.leaveRequest.findMany({
            where:{
                employee_id
            },
            include: {
                employee: true,
                leave: true
            }
        });

        return ResponseFormatter.success(
            "Leave request fetched successfully",
            leaveRequestEmployees
        );
    }

    // Get employee by user id
    async getEmployeeByUserId(
        user_id: number
    ) : Promise<ResponseFormatter> {
        const employee = await this.prisma.employee.findMany({
            where: {
                user_id
            }
        });

        return employee;
    }

    // Get leaveRequestEmployee by id
    async getLeaveRequestEmployeeById(
        leaveRequestWhereUniqueInput: Prisma.LeaveRequestWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const leaveRequestEmployee = await this.prisma.leaveRequest.findUnique({
            where: leaveRequestWhereUniqueInput,
            include: {
                employee: true,
                leave: true
            }
        });

        return ResponseFormatter.success(
            "Leave request fetched successfully",
            leaveRequestEmployee
        );
    }

    // Store leaveRequestEmployee to database
    async createLeaveRequestEmployee(dto: LeaveRequestEmployeeDto, employee_id: number) : Promise<ResponseFormatter> {
        try {
            const start_date = new Date(dto.start_date);
            const end_date = new Date(dto.end_date);
            const longLeave = this.calculateLeaveDays(start_date, end_date)
            const leaveRequestEmployee = await this.prisma.leaveRequest.create({
                data: {
                    ...dto,
                    long_leave: longLeave,
                    status: "Pending",
                    employee_id: employee_id
                },
                include: {
                    employee: true
                }
            });

            return ResponseFormatter.success(
                "Leave request created successfully",
                leaveRequestEmployee,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('LeaveRequestEmployee already exist');
            }
    
            throw new InternalServerErrorException('Leave request failed to create');
        }
    } 

    // Update leaveRequestEmployee in database
    async updateLeaveRequestEmployee(
        where: Prisma.LeaveRequestWhereUniqueInput,
        dto: LeaveRequestEmployeeDto
    ) : Promise<ResponseFormatter> {
        try {

            const start_date = new Date(dto.start_date);
            const end_date = new Date(dto.end_date);
            const longLeave = this.calculateLeaveDays(start_date, end_date);

            const leaveRequestEmployeeById = await this.getLeaveRequestEmployeeById(where);

            if(leaveRequestEmployeeById["data"]["status"] !== "Pending"){
                throw new BadRequestException("Leave request has already been processed and cannot be edited.");
            }

            const leaveRequestEmployee = await this.prisma.leaveRequest.update({
                where,
                data: {
                        ...dto,
                        long_leave: longLeave
                },
                include: {
                    employee: true
                }
            });

            return ResponseFormatter.success(
                "Leave request updated successfully",
                leaveRequestEmployee
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            throw new InternalServerErrorException('Leave request failed to update');
        }
    }

    // Delete leaveRequestEmployee in database
    async deleteLeaveRequestEmployee(where: Prisma.LeaveRequestWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const leaveRequestEmployeeById = await this.getLeaveRequestEmployeeById(where);

            if(leaveRequestEmployeeById["data"]["status"] !== "Pending"){
                throw new BadRequestException("Leave request has already been processed and cannot be edited.");
            }

            const leaveRequestEmployee = await this.prisma.leaveRequest.delete({
                where,
                include: {
                    employee: true
                }
            });

            return ResponseFormatter.success(
                "Leave request deleted successfully",
                leaveRequestEmployee
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

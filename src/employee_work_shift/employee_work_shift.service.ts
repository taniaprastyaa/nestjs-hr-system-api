import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeWorkShiftDto } from './dto';

@Injectable()
export class EmployeeWorkShiftService {
    constructor(private prisma: PrismaService) {}

    // Get all employee work shifts
    async getAllEmployeeWorkShifts() : Promise<ResponseFormatter> {
        const employeeWorkShifts = await this.prisma.client.employeeWorkShift.findMany(
            {
                include: {
                  employee: true,
                  shift: true,
                },
            },
        );

        return ResponseFormatter.success(
            "Employee Work shift fetched successfully",
            employeeWorkShifts
        );
    }

    async getEmployeeWorkShiftsPerDepartment(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.client.employee.findFirst({
            where: {
                user_id
            }
        });
        
        const employeeWorkShifts = await this.prisma.client.employeeWorkShift.findMany(
            {
                where: {
                    employee: {
                        department_id: employee.department_id
                    }
                },
                include: {
                  employee: true,
                  shift: true,
                },
            },
        );

        return ResponseFormatter.success(
            "Employee Work shift fetched successfully",
            employeeWorkShifts
        );
    }

    async getEmployeeWorkShift(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.client.employee.findFirst({
            where: {
                user_id
            }
        });
        
        const employeeWorkShifts = await this.prisma.client.employeeWorkShift.findFirst(
            {
                where: {
                    employee_id: employee.id
                },
                include: {
                  employee: true,
                  shift: true,
                },
            },
        );

        return ResponseFormatter.success(
            "Employee Work shift fetched successfully",
            employeeWorkShifts
        );
    }


    // Get employee work shift by id
    async getEmployeeWorkShiftById(
        employeeWorkShiftWhereUniqueInput: Prisma.EmployeeWorkShiftWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const employeeWorkShift = await this.prisma.client.employeeWorkShift.findUnique({
            where: employeeWorkShiftWhereUniqueInput,
            include: {
                employee: true,
                shift: true,
            },
        });

        return ResponseFormatter.success(
            "Employee Work shift fetched successfully",
            employeeWorkShift
        );
    }

    // Store employee work shift to database
    async createEmployeeWorkShift(dto: EmployeeWorkShiftDto) : Promise<ResponseFormatter> {
        try {
            const employeeWorkShift = await this.prisma.client.employeeWorkShift.create({
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "Employee WorkShift created successfully",
                employeeWorkShift,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Work shift already exist');
            }
    
            throw new InternalServerErrorException('Work shift failed to create');
        }
    } 

    // Update employee work shift in database
    async updateEmployeeWorkShift(params: {
        where: Prisma.EmployeeWorkShiftWhereUniqueInput;
        dto: EmployeeWorkShiftDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;
            const employeeWorkShift = await this.prisma.employeeWorkShift.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Employee Work shift updated successfully",
                employeeWorkShift
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Work shift already exist');
            }

            throw new InternalServerErrorException('Work shift failed to update');
        }
    }

    // Delete employee work shift in database
    async deleteEmployeeWorkShift(where: Prisma.EmployeeWorkShiftWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const employeeWorkShift = await this.prisma.client.employeeWorkShift.delete({
                id: where.id,
            });

            return ResponseFormatter.success(
                "Employee Work shift deleted successfully",
                employeeWorkShift
            );
        } catch (err) {
            throw new InternalServerErrorException('Work shift failed to delete');
        }
    }
}

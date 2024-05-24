import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeOvertimeDto } from './dto';

@Injectable()
export class EmployeeOvertimeService {
    constructor(private prisma: PrismaService) {}

    // Get all Employeeovertimes
    async getAllEmployeeOvertime() : Promise<ResponseFormatter> {
        const employeeOvertimes = await this.prisma.overtime.findMany({
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "EmployeeOvertime fetched successfully",
            employeeOvertimes
        );
    }

    // Get Employeeovertime by id
    async getEmployeeOvertimeById(
        EmployeeovertimeWhereUniqueInput: Prisma.OvertimeWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const employeeOvertime = await this.prisma.overtime.findUnique({
            where: EmployeeovertimeWhereUniqueInput,
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "Employee overtime fetched successfully",
            employeeOvertime
        );
    }

    // Store employee overtime to database
    async createEmployeeOvertime(dto: EmployeeOvertimeDto, user_id: number) : Promise<ResponseFormatter> {
        const duration = this.calculateDuration(dto.start_time, dto.end_time);
        const employee = await this.prisma.employee.findFirst({
            where: {
                user_id
            }
        });

        try {
            const employeeOvertime = await this.prisma.overtime.create({
                data: {
                    ...dto,
                    duration,
                    status: "Pending",
                    employee_id: employee.id
                },
                include: {
                    employee: true
                }
            });

            return ResponseFormatter.success(
                "Employee overtime created successfully",
                employeeOvertime,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('EmployeeOvertime already exist');
            }
    
            throw new InternalServerErrorException('Employee overtime failed to create');
        }
    } 

    // Update Employeeovertime in database
    async updateEmployeeOvertime(params: {
        where: Prisma.OvertimeWhereUniqueInput;
        dto: EmployeeOvertimeDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;

            const duration = this.calculateDuration(dto.start_time, dto.end_time);

            const existingEmployeeOvertime = await this.getEmployeeOvertimeById(where);

            if(existingEmployeeOvertime["data"]["status"] !== "Pending"){
                throw new BadRequestException("Employee overtime has already been processed and cannot be edited.")
            }

            const Employeeovertime = await this.prisma.overtime.update({
                where,
                data: {
                    ...dto,
                    duration
                },
                include: {
                    employee: true
                }
            });

            return ResponseFormatter.success(
                "Employee overtime updated successfully",
                Employeeovertime
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            throw new InternalServerErrorException('Employee overtime failed to update');
        }
    }

    // Delete Employeeovertime in database
    async deleteEmployeeOvertime(where: Prisma.OvertimeWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const existingEmployeeOvertime = await this.getEmployeeOvertimeById(where);

            if(existingEmployeeOvertime["data"]["status"] !== "Pending"){
                throw new BadRequestException("Employee overtime has already been processed and cannot be deleted.")
            }

            const employeeOvertime = await this.prisma.overtime.delete({
                where,
            });

            return ResponseFormatter.success(
                "EmployeeOvertime deleted successfully",
                employeeOvertime
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            throw new InternalServerErrorException('EmployeeOvertime failed to delete');
        }
    }

    // Calculate duration between start_time and end_time
    calculateDuration(start: string, end: string): number {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
    
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
    
        const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
    
        return durationHours;
    }
    
}

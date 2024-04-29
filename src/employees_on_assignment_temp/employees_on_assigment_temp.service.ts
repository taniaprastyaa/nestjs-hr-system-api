import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeesOnAssignmentTempDto} from './dto';
const logger = new Logger('EmployeesOnAssignmentService');

@Injectable()
export class EmployeesOnAssignmentTempService {
    constructor(private prisma: PrismaService) {}

    // Get all employees On Assignments
    async getAllEmployeesOnAssignment(user_id: number) : Promise<ResponseFormatter> {
        const employeesOnAssignments = await this.prisma.employeesOnAssignmentTemp.findMany({
            where: {
                user_id
            },
            include: {
                employee: true,
            }
        });

        return ResponseFormatter.success(
            "Employees on assignment fetched successfully",
            employeesOnAssignments
        );
    }

    // Get employeesOnAssignment by id
    async getEmployeeOnAssignmentById(
        employeesOnAssignmentTempWhereUniqueInput: Prisma.EmployeesOnAssignmentTempWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const employeesOnAssignment = await this.prisma.employeesOnAssignmentTemp.findUnique({
            where: employeesOnAssignmentTempWhereUniqueInput,
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "Employees on assignment fetched successfully",
            employeesOnAssignment
        );
    }

    // Store employeesOnAssignment to database
    async createEmployeeOnAssignment(dto: EmployeesOnAssignmentTempDto, user_id: number) : Promise<ResponseFormatter> {
        try {
            const existingEmployee = await this.isEmployeeExist(dto.employee_id, user_id);

            if (existingEmployee) {
                throw new BadRequestException('Employee already exists');
            }

            const employeesOnAssignment = await this.prisma.employeesOnAssignmentTemp.create({
                data: {
                    ...dto,
                    user_id
                }
            });

            return ResponseFormatter.success(
                "Employees on assignment created successfully",
                employeesOnAssignment,
                201
            );
        } catch (err) {
            logger.error('Error creating employee task:', err);

            if (err instanceof BadRequestException) {
                throw err;
            }
    
            throw new InternalServerErrorException('Employee on assignment failed to create');
        }
    } 

    // Delete employee on assignment by employee_id
    async deleteEmployeeOnAssignmentByEmployeeId(employee_id: number, user_id: number) : Promise<ResponseFormatter> {
        try {
            const employeesOnAssignment = await this.prisma.employeesOnAssignmentTemp.deleteMany({
                where: {
                    employee_id: employee_id,
                    user_id: user_id
                },
            });

            return ResponseFormatter.success(
                "Employee Task deleted successfully",
                employeesOnAssignment
            );
        } catch (err) {
            throw new InternalServerErrorException('Employee on assignment failed to delete');
        }
    }

    // Delete all employees on assignment temp
    async deleteAllEmployeesOnAssignment( user_id: number) : Promise<ResponseFormatter> {
        try {
            const employeesOnAssignment = await this.prisma.employeesOnAssignmentTemp.deleteMany({
                where: {
                    user_id: user_id
                }
            });

            return ResponseFormatter.success(
                "Employee Task deleted successfully",
                employeesOnAssignment
            );
        } catch (err) {
            throw new InternalServerErrorException('Employee on assignment failed to delete');
        }
    }


    async isEmployeeExist(employee_id, user_id) {
        const existingEmployee = await this.prisma.employeesOnAssignmentTemp.findMany({
            where: {
                employee_id,
                user_id
            }
        });

        return (existingEmployee.length === 0) ? false : existingEmployee[0];
        ;
    }
}

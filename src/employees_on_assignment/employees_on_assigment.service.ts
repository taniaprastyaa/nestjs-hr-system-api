import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeesOnAssignmentDto} from './dto';
const logger = new Logger('EmployeesOnAssignmentService');

@Injectable()
export class EmployeesOnAssignmentService {
    constructor(private prisma: PrismaService) {}

    // Get all employees On Assignments
    async getAllEmployeesOnAssignment(employee_task_id: number) : Promise<ResponseFormatter> {
        // console.log(employee_task_id)
        const employeesOnAssignment = await this.prisma.employeesOnAssignment.findMany({
            where: {
                employee_task_id
            },
            include: {
                employee: true,
            }
        });

        return ResponseFormatter.success(
            "Employees on assignment fetched successfully",
            employeesOnAssignment
        );
    }

    // Store employees on assignment to database
    async createEmployeeOnAssignment(dto: EmployeesOnAssignmentDto) : Promise<ResponseFormatter> {
        try {
            const existingEmployee = await this.isEmployeeExist(dto.employee_id, dto.employee_task_id);

            if (existingEmployee) {
                throw new BadRequestException('Employee already exists');
            }

            const employeesOnAssignment = await this.prisma.employeesOnAssignment.create({
                data: {
                    ...dto,
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

    // Delete employee on assignment by id
    async deleteEmployeeOnAssignmentById(where: Prisma.EmployeesOnAssignmentWhereUniqueInput) : Promise<ResponseFormatter> {
        console.log(where);
        try {
            const employeesOnAssignment = await this.prisma.employeesOnAssignment.delete({
                where,
            });

            return ResponseFormatter.success(
                "Employee Task deleted successfully",
                employeesOnAssignment
            );
        } catch (err) {
            logger.error('Error creating employee task:', err);

            throw new InternalServerErrorException('Employee on assignment failed to delete');
        }
    }


    async isEmployeeExist(employee_id, employee_task_id) {
        const existingEmployee = await this.prisma.employeesOnAssignment.findMany({
            where: {
                employee_id,
                employee_task_id
            }
        });

        return (existingEmployee.length === 0) ? false : existingEmployee[0];
        ;
    }
}

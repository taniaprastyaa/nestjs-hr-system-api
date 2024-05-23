import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeTaskDto} from './dto';
const logger = new Logger('EmployeeTaskService');

@Injectable()
export class EmployeeTaskService {
    constructor(private prisma: PrismaService) {}

    // Get all employee tasks
    async getAllEmployeeTasks(): Promise<ResponseFormatter> {
        try {
          const employeeTasks = await this.prisma.employeeTask.findMany({
            include: {
              department: true,
              employee: true
            },
          });
      
          const employeeTaskInfo = [];
      
          for (const task of employeeTasks) {
            const employeesOnAssignment = await this.prisma.employeesOnAssignment.findMany({
              where: {
                employee_task_id: task.id,
              },
              include: {
                employee: true,
              },
            });
      
            employeeTaskInfo.push({
              ...task,
              employees: employeesOnAssignment.map((assignment) => assignment["employee"]),
            });
          }
      
          return ResponseFormatter.success(
            "EmployeeTask fetched successfully",
            employeeTaskInfo
          );
        } catch (err) {
          throw new InternalServerErrorException('Failed to fetch employee tasks');
        }
      }
      

    // Get employee task by id
    async getEmployeeTaskById(
        employeeTaskWhereUniqueInput: Prisma.EmployeeTaskWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const employeeTask = await this.prisma.employeeTask.findUnique({
            where: employeeTaskWhereUniqueInput,
            include: {
                department: true,
            }
        });

        const employeesOnAssignments = await this.prisma.employeesOnAssignment.findMany({
            where: {
                employee_task_id: employeeTaskWhereUniqueInput.id
            },
            include: {
                employee: true,
            }
        });

        const employeeTaskDetail = [employeeTask, employeesOnAssignments]

        return ResponseFormatter.success(
            "EmployeeTask fetched successfully",
            employeeTaskDetail
        );
    }

    // Store employee task to database
    async createEmployeeTask(dto: EmployeeTaskDto) {
        try {
            console.log(dto);
            const employeeTask = await this.prisma.employeeTask.create({
                data: {
                    ...dto
                }
            });

            return employeeTask;
        } catch (err) {
            logger.error('Error creating employee task:', err);

            if(err.code === 'P2002') {
                throw new BadRequestException('Employee Task already exist');
            }
    
            throw new InternalServerErrorException('Employee Task failed to create');
        }
    } 

    // Update employee task in database
    async updateEmployeeTask(params: {
        where: Prisma.EmployeeTaskWhereUniqueInput;
        dto: EmployeeTaskDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;
            const employeeTask = await this.prisma.employeeTask.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Employee Task updated successfully",
                employeeTask
            );
        } catch (err) {
            logger.error('Error updating employee task:', err);

            if(err.code === 'P2002') {
                throw new BadRequestException('EmployeeTask already exist');
            }

            throw new InternalServerErrorException('Employee Task failed to update');
        }
    }

    // Delete employee task in database
    async deleteEmployeeTask(where: Prisma.EmployeeTaskWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const employeeTask = await this.prisma.employeeTask.findUnique({
                where
            });

            const employeesOnAssignment = await this.prisma.employeesOnAssignment.deleteMany({
                where: {
                    employee_task_id: where.id
                }
            });

            if(employeesOnAssignment) {
                const employeeTask = await this.prisma.employeeTask.delete({
                    where,
                });
            }

            return ResponseFormatter.success(
                "Employee Task deleted successfully",
                employeeTask
            );
        } catch (err) {
            logger.error('Error updating employee task:', err);

            throw new InternalServerErrorException('Employee Task failed to delete');
        }
    }

    // Get all employees on assignment
    async getAllEmployeesOnAssignment(user_id: number) {
        const employeesOnAssignment = await this.prisma.employeesOnAssignmentTemp.findMany({
            where: {
                user_id
            },
            include: {
                employee: true,
            }
        });

        return (employeesOnAssignment.length === 0) ? false : employeesOnAssignment;
        ;
    }

    // Store employee on assigment
    async addEmployeesOnAssignment(
        employee_id: number,
        employee_task_id: number,
    ): Promise<void> {
        try {
        await this.prisma.employeesOnAssignment.create({
            data: {
                employee_id,
                employee_task_id
            },
        });

        } catch (error) {
        // Handle error here if necessary
        throw new InternalServerErrorException('Failed to add employee on assignment');
        }
    }

    // Delete all employees on assignment temp
    async clearEmployeesOnAssignmentTemp( user_id: number) : Promise<ResponseFormatter> {
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
            throw new InternalServerErrorException('Employee Task failed to delete');
        }
    }
}

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
     
    async getEmployeeTasksPerDepartment(user_id: number): Promise<ResponseFormatter> {
        try {
          const employee = await this.prisma.employee.findFirst({
              where: {
                  user_id
              }
          });

          const employeeTasks = await this.prisma.employeeTask.findMany({
            where: {
                department_id: employee.department_id
            },
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

    async getEmployeeTasks(user_id: number): Promise<ResponseFormatter> {
        try {
          const employee = await this.prisma.employee.findFirst({
              where: {
                  user_id
              }
          });

          const employeeTasks = await this.prisma.employeeTask.findMany({
            where: {
                assignedEmployees: {
                    some: {
                        employee_id: employee.id
                    }
                }
            },
            include: {
                assignedEmployees: {
                    include: {
                        employee: true
                    }
                }
            }
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
    async createEmployeeTask(user_id: number, dto: EmployeeTaskDto) {
        try {
            const employee = await this.prisma.employee.findFirst({
                where: {
                    user_id
                }
            })
            const employeeTask = await this.prisma.employeeTask.create({
                data: {
                    task_title: dto.task_description,
                    task_description: dto.task_description,
                    deadline: dto.deadline,
                    status: dto.status,
                    department_id: dto.department_id,
                    priority: dto.priority,
                    completedAt: dto.completedAt,
                    notes: dto.notes,
                    attachment: dto.attachment,
                    assigned_by: employee.id
                }
            });
    
            for (const employee_id of dto.employee_on_assignment_ids) {
                const employeeExists = await this.prisma.employee.findUnique({
                    where: {
                        id: employee_id
                    }
                });
    
                if (employeeExists) {
                    await this.prisma.employeesOnAssignment.create({
                        data: {
                            employee_id,
                            employee_task_id: employeeTask.id
                        }
                    });
                } else {
                    throw new BadRequestException(`Employee with ID ${employee_id} does not exist`);
                }
            }
    
            return employeeTask;
        } catch (err) {
            logger.error('Error creating employee task:', err);

            if (err instanceof BadRequestException) {
                throw err;
            }
    
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
        user_id: number;
    }): Promise<ResponseFormatter> {
        try {
            const { where, dto, user_id } = params;

            const employee = await this.prisma.employee.findFirst({
                where: {
                    user_id
                }
            })
    
            const existingTask = await this.prisma.employeeTask.findUnique({
                where,
                include: {
                    assignedEmployees: true,
                }
            });
    
            if (!existingTask) {
                throw new BadRequestException('Employee Task not found');
            }
    
            // Delete existing assigned employees
            await this.prisma.employeesOnAssignment.deleteMany({
                where: {
                    employee_task_id: existingTask.id,
                }
            });
    
            // Update the employee task
            const employeeTask = await this.prisma.employeeTask.update({
                where,
                data: {
                    task_title: dto.task_description,
                    task_description: dto.task_description,
                    deadline: dto.deadline,
                    status: dto.status,
                    department_id: dto.department_id,
                    priority: dto.priority,
                    completedAt: dto.completedAt,
                    notes: dto.notes,
                    attachment: dto.attachment,
                    assigned_by: employee["id"]
                }
            });
    
            // Add new assigned employees
            for (const employee_id of dto.employee_on_assignment_ids) {
                const employeeExists = await this.prisma.employee.findUnique({
                    where: {
                        id: employee_id
                    }
                });
    
                if (employeeExists) {
                    await this.prisma.employeesOnAssignment.create({
                        data: {
                            employee_id,
                            employee_task_id: employeeTask.id
                        }
                    });
                } else {
                    throw new BadRequestException(`Employee with ID ${employee_id} does not exist`);
                }
            }
    
            return ResponseFormatter.success(
                "Employee Task updated successfully",
                employeeTask
            );
        } catch (err) {
            logger.error('Error updating employee task:', err);
    
            if (err.code === 'P2002') {
                throw new BadRequestException('Employee Task already exists');
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
}

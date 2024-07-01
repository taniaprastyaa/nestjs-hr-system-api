import { BadRequestException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import * as argon from 'argon2';
const logger = new Logger('EmployeeTaskService');

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) {}

    // Get all employees 
    async getAllEmployees() : Promise<ResponseFormatter> {
        const employees = await this.prisma.client.employee.findMany({
            include: {
              user: true,
              department: true,
              position: true
            },
        });

        return ResponseFormatter.success(
            "Employees fetched successfully",
            employees
        )
    }

    async getAllEmployeesPerDepartment(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.client.employee.findFirst({
            where: {
                user_id
            }
        })
        const employees = await this.prisma.employee.findMany({
            where: {
                department_id: employee.department_id
            },
            include: {
              user: true,
              department: true,
              position: true
            },
        });

        return ResponseFormatter.success(
            "Employees fetched successfully",
            employees
        )
    }

    // Get employee by id 
    async getEmployeeById(
        employeeWhereUniqueInput: Prisma.EmployeeWhereUniqueInput,
    ): Promise<ResponseFormatter> {
        const employee = await this.prisma.client.employee.findUnique({
            where: employeeWhereUniqueInput,
            include: {
                user: true,
                department: true,
                position: true
            },
        });

        return ResponseFormatter.success(
            "Employee fetched successfully",
            employee
        )
    }

    // Store employee to database
    async createEmployee(dto: CreateEmployeeDto): Promise<ResponseFormatter>{
        // Check if the provided phone number already exists for any employee
        const existingEmployee = await this.prisma.employee.findFirst({
            where: {
                phone: dto.phone
            }
        });

        if (existingEmployee) {
            throw new BadRequestException('Employee with the same phone number already exists');
        }

        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    username : dto.username,
                    email : dto.email,
                    password : hash,
                    role : dto.role,
                },
            });

            const userId = await this.getUserLimit1();

            const employee = await this.prisma.employee.create({
                data: {
                    full_name : dto.full_name,
                    phone : dto.phone,
                    address : dto.address,
                    date_of_birth : dto.date_of_birth,
                    gender : dto.gender,
                    work_entry_date : dto.work_entry_date,
                    employee_status : dto.employee_status,
                    user_id : userId.id,
                    department_id : dto.department_id,
                    position_id : dto.position_id,
                },
            });

            // Create employee leave allowance
            const currentYear = new Date().getFullYear().toString();
            const employeeLeaveAllowance = await this.prisma.leaveAllowance.create({
                data: {
                    employee_id : employee.id,
                    year : currentYear,
                },
            });

            const userEmployee = {user, employee};
            
            return ResponseFormatter.success(
                "Employee created succesfully",
                userEmployee,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Employee already exist');
            }

            throw new InternalServerErrorException('Employee failed to create');
        }
    }

    // Update employee in database
    async updateEmployee(params: {
        where: Prisma.EmployeeWhereUniqueInput;
        dto: UpdateEmployeeDto;
    }) {
        try {
            const {dto, where} = params;
            const existingEmployee = await this.prisma.employee.findUnique({
                where,
                include : {
                    user: true
                }
            });

            const employee = await this.prisma.employee.update({
                where,
                data: {
                    full_name : dto.full_name,
                    phone : dto.phone,
                    address : dto.address,
                    date_of_birth : dto.date_of_birth,
                    gender : dto.gender,
                    work_entry_date : dto.work_entry_date,
                    employee_status : dto.employee_status,
                    department_id : dto.department_id,
                    position_id : dto.position_id,
                },
            });

            const user = await this.prisma.user.update({
                where : {
                    id : existingEmployee.user_id
                },
                data: {
                    username : dto.username,
                    email : dto.email,
                    role : dto.role
                },
            });

            const userEmployee = {user, employee};

            return ResponseFormatter.success(
                "Employee updated successfully",
                userEmployee
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Employee already exist');
            }

            throw new InternalServerErrorException('Employee failed to create');
        }
    }

    // Delete employee in database
    async deleteEmployee(where: Prisma.EmployeeWhereUniqueInput): Promise<ResponseFormatter> {
        try {
            const existingEmployee = await this.prisma.employee.findUnique({
                where,
                include : {
                    user: true
                }
            });

            const leaveRequested = await this.prisma.client.leaveRequest.deleteMany({
                id: where.id
            });
    
            const leaveAllowance = await this.prisma.client.leaveAllowance.deleteMany({
                id: where.id
            });
    
            const attendance = await this.prisma.client.attendance.deleteMany({
                id: where.id
            });
    
            const employeeWorkShift = await this.prisma.client.employeeWorkShift.deleteMany({
                id: where.id
            });
    
            const salarySlip = await this.prisma.client.salarySlip.deleteMany({
                id: where.id
            });
    
            const employeeOnAssignment = await this.prisma.client.employeesOnAssignment.deleteMany({
                id: where.id
            });
    
            const overtime = await this.prisma.client.overtime.deleteMany({
                id: where.id
            });
    
            const employeeTask = await this.prisma.client.employeeTask.deleteMany({
                id: where.id
            });

            const employee = await this.prisma.client.employee.delete({
                id: where.id,
            });

            const user = await this.prisma.client.user.delete({
                id : existingEmployee.user_id
            });

            const userEmployee = {user, employee, leaveRequested, leaveAllowance, attendance, employeeWorkShift, salarySlip, employeeOnAssignment, overtime, employeeTask};

            return ResponseFormatter.success(
                "Employee deleted successfully",
                userEmployee
            );
        } catch (err) {
            logger.error('Error delete employee :', err);

            throw new InternalServerErrorException('Employee failed to delete');
        } 
    }

    async getUserLimit1() {
        return this.prisma.user.findFirst({
          orderBy: { id: 'desc' },
          take: 1,
        });
    }

    async getStatistics(user_id: number) {
        const employee = await this.prisma.client.employee.findFirst({
            where: {
                user_id
            }
        });

        const totalEmployees = await this.prisma.client.employee.count();

        const totalHod = await this.prisma.client.employee.count({
            where: {
                user: {
                    role: 'HOD'
                }
            }
        });
    
        if(employee) {
            const totalEmployeePerDepartment = await this.prisma.client.employee.count({
                where:{
                    department_id: employee.department_id
                }
            })

            return {
                totalEmployeePerDepartment,
            }
        } else {
            return {
                totalEmployees,
                totalHod
            }
        }

    }
}

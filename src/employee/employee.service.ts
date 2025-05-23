import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
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
    async createEmployee(dto: CreateEmployeeDto): Promise<ResponseFormatter> {
        try {
            // Cek username atau email sudah dipakai
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { username: dto.username },
                        { email: dto.email }
                    ]
                }
            });

            if (existingUser) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Username or email already exists.',
                    error: 'Conflict',
                });
            }

            // Cek nomor telepon unik
            const existingPhoneEmployee = await this.prisma.employee.findFirst({
                where: {
                    phone: dto.phone
                }
            });

            if (existingPhoneEmployee) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Phone number already exists.',
                    error: 'Conflict',
                });
            }

            // Hash password
            const hash = await argon.hash(dto.password);

            // Transaksi prisma
            const result = await this.prisma.$transaction(async (tx) => {
                // Buat user
                const user = await tx.user.create({
                    data: {
                        username: dto.username,
                        email: dto.email,
                        password: hash,
                        role: dto.role,
                    },
                });

                // Buat employee
                const employee = await tx.employee.create({
                    data: {
                        full_name: dto.full_name,
                        phone: dto.phone,
                        address: dto.address,
                        date_of_birth: dto.date_of_birth,
                        gender: dto.gender,
                        work_entry_date: dto.work_entry_date,
                        employee_status: dto.employee_status,
                        user_id: user.id,
                        department_id: dto.department_id,
                        position_id: dto.position_id,
                    },
                });

                // Buat leave allowance
                await tx.leaveAllowance.create({
                    data: {
                        employee_id: employee.id,
                        year: new Date().getFullYear().toString(),
                    },
                });

                return { user, employee };
            });

            return ResponseFormatter.success(
                "Employee created successfully",
                result,
                201
            );
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }

            if (err.code === 'P2002') {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Unique constraint failed.',
                    error: 'Conflict',
                });
            }

            throw new InternalServerErrorException('Employee failed to create');
        }
    }

    // Update employee in database
    async updateEmployee(params: {
        where: Prisma.EmployeeWhereUniqueInput;
        dto: UpdateEmployeeDto;
    }): Promise<ResponseFormatter> {
        try {
            const { dto, where } = params;

            const existingEmployee = await this.prisma.employee.findUnique({
                where,
                include: {
                    user: true
                }
            });

            if (!existingEmployee) {
                throw new BadRequestException('Employee not found');
            }

            // Cek email/username digunakan oleh user lain
            const conflictingUser = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        {
                            OR: [
                                { username: dto.username },
                                { email: dto.email }
                            ]
                        },
                        { id: { not: existingEmployee.user_id } }
                    ]
                }
            });

            if (conflictingUser) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Username or email already exists.',
                    error: 'Conflict',
                });
            }

            // Cek nomor telepon unik
            const existingPhoneEmployee = await this.prisma.employee.findFirst({
                where: {
                    phone: dto.phone,
                    id: { not: existingEmployee.id }
                }
            });

            if (existingPhoneEmployee) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Phone number already exists.',
                    error: 'Conflict',
                });
            }

            // Jalankan dalam transaksi
            const result = await this.prisma.$transaction(async (tx) => {
                const updatedEmployee = await tx.employee.update({
                    where,
                    data: {
                        full_name: dto.full_name,
                        phone: dto.phone,
                        address: dto.address,
                        date_of_birth: dto.date_of_birth,
                        gender: dto.gender,
                        work_entry_date: dto.work_entry_date,
                        employee_status: dto.employee_status,
                        department_id: dto.department_id,
                        position_id: dto.position_id,
                    },
                });

                const updatedUser = await tx.user.update({
                    where: {
                        id: existingEmployee.user_id,
                    },
                    data: {
                        username: dto.username,
                        email: dto.email,
                        role: dto.role,
                    },
                });

                return { updatedUser, updatedEmployee };
            });

            return ResponseFormatter.success(
                "Employee updated successfully",
                { user: result.updatedUser, employee: result.updatedEmployee }
            );
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }

            if (err.code === 'P2002') {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Unique constraint failed.',
                    error: 'Conflict',
                });
            }

            throw new InternalServerErrorException('Employee failed to update');
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

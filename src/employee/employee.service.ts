import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import * as argon from 'argon2'

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) {}

    // Get all employees 
    async getAllEmployees() : Promise<ResponseFormatter> {
        const employees = await this.prisma.employee.findMany({
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
        const employee = await this.prisma.employee.findUnique({
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

            const employee = await this.prisma.employee.delete({
                where,
            });

            const user = await this.prisma.user.delete({
                where : {
                    id : existingEmployee.user_id
                },
            });

            const userEmployee = {user, employee};

            return ResponseFormatter.success(
                "Employee deleted successfully",
                userEmployee
            );
        } catch (err) {
            throw new InternalServerErrorException('Employee failed to delete');
        } 
    }

    async getUserLimit1() {
        return this.prisma.user.findFirst({
          orderBy: { id: 'desc' },
          take: 1,
        });
    }
}

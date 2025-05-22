import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService) {}

    // Get all departments
    async getAllDepartment() : Promise<ResponseFormatter> {
        const departments = await this.prisma.client.department.findMany();

        return ResponseFormatter.success(
            "Department fetched successfully",
            departments
        );
    }

    // Get department by id
    async getDepartmentById(
        departmentWhereUniqueInput: Prisma.DepartmentWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const department = await this.prisma.client.department.findUnique({
            where: departmentWhereUniqueInput,
        });

        return ResponseFormatter.success(
            "Department fetched successfully",
            department
        );
    }

    // Store department to database
    async createDepartment(dto: DepartmentDto): Promise<ResponseFormatter> {
        try {
            const existing = await this.prisma.department.findFirst({
                where: {
                    department_name: dto.department_name,
                    deletedAt: null,
                },
            });

            if (existing) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Department name already exists.',
                    error: 'Conflict',
                });
            }

            const department = await this.prisma.department.create({
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "Department created successfully",
                department,
                201
            );
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }

            if (err.code === 'P2002') {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Department name already exists.',
                    error: 'Conflict',
                });
            }

            throw new InternalServerErrorException('Department failed to create');
        }
    }

    // Update department in database
    async updateDepartment(params: {
        where: Prisma.DepartmentWhereUniqueInput;
        dto: DepartmentDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;

            const existing = await this.prisma.department.findFirst({
                where: {
                    department_name: dto.department_name,
                    deletedAt: null,
                },
            });

            if (existing) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Department name already exists.',
                    error: 'Conflict',
                });
            }

            const department = await this.prisma.department.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Department updated successfully",
                department
            );
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }

            if (err.code === 'P2002') {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Department name already exists.',
                    error: 'Conflict',
                });
            }

            throw new InternalServerErrorException('Department failed to update');
        }
    }

    // Delete department in database
    async deleteDepartment(where: Prisma.DepartmentWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const department = await this.prisma.client.department.delete({
               id: where.id,
            });

            return ResponseFormatter.success(
                "Department deleted successfully",
                department
            );
        } catch (err) {
            throw new InternalServerErrorException('Department failed to delete');
        }
    }

    async getStatistics() {
        const totalDepartments = await this.prisma.client.department.count();
    
        return {
            totalDepartments
        };
    }
}

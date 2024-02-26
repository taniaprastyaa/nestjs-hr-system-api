import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService) {}

    // Get all departments
    async getAllDepartment() {
        const departments = await this.prisma.department.findMany();

        return departments;
    }

    // Get department by id
    async getDepartmentById(
        departmentWhereUniqueInput: Prisma.DepartmentWhereUniqueInput,
    ) {
        const department = await this.prisma.department.findUnique({
            where: departmentWhereUniqueInput,
        });

        return department;
    }

    // Store department to database
    async createDepartment(dto: DepartmentDto) {
        try {
            const department = await this.prisma.department.create({
                data: {
                    ...dto,
                }
            });

            return department;
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Department already exist');
            }
    
            throw new InternalServerErrorException('Department failed to create');
        }
    } 

    // Update department in database
    async updateDepartment(params: {
        where: Prisma.DepartmentWhereUniqueInput;
        dto: DepartmentDto;
    }) {
        try {
            const {where, dto} = params;
            const department = await this.prisma.department.update({
                where,
                data: {...dto,}
            });

            return department;
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Department already exist');
            }

            throw new InternalServerErrorException('Department failed to update');
        }
    }

    // Delete department in database
    async deleteDepartment(where: Prisma.DepartmentWhereUniqueInput) {
        try {
            const department = await this.prisma.department.delete({
                where,
            });

            return department;
        } catch (err) {
            throw new InternalServerErrorException('Department failed to delete');
        }
    }
}

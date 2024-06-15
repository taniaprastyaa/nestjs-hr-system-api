import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDocumentDto, UpdateDepartmentDocumentDto } from './dto';

@Injectable()
export class DepartmentDocumentService {
    constructor(private prisma: PrismaService) {}

    // Get all department documents
    async getAllDepartmentDocuments() : Promise<ResponseFormatter> {
        const departmentDocuments = await this.prisma.client.departmentDocument.findMany({
            include: {
                department: true
            }
        });

        return ResponseFormatter.success(
            "Department document fetched successfully",
            departmentDocuments
        );
    }

    async getDepartmentDocumentsPerDepartment(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.client.employee.findFirst({
            where: {
                user_id
            }
        })
        const departmentDocuments = await this.prisma.client.departmentDocument.findMany({
            where: {
                department_id: employee.department_id
            }
        });

        return ResponseFormatter.success(
            "Department document fetched successfully",
            departmentDocuments
        );
    }

    // Get department document by id
    async getDepartmentDocumentById(
        departmentDocumentWhereUniqueInput: Prisma.DepartmentDocumentWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const departmentDocument = await this.prisma.client.departmentDocument.findUnique({
            where: departmentDocumentWhereUniqueInput,
        });

        return ResponseFormatter.success(
            "Department document fetched successfully",
            departmentDocument
        );
    }

    // Store department document to database
    async createDepartmentDocument(dto: CreateDepartmentDocumentDto, user_id: number) : Promise<ResponseFormatter> {
        try {
            const employee = await this.prisma.client.employee.findFirst({
                where: {
                    user_id
                }
            })
            const department = await this.prisma.departmentDocument.create({
                data: {
                    ...dto,
                    department_id: employee.department_id
                },
                include: {
                    department: true
                },
            });

            return ResponseFormatter.success(
                "Department document created successfully",
                department,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Department document with the same name or document file already exist');
            }
    
            throw new InternalServerErrorException('Department document failed to create');
        }
    } 

    // Update department document in database
    async updateDepartmentDocument(params: {
        where: Prisma.DepartmentDocumentWhereUniqueInput;
        dto: UpdateDepartmentDocumentDto;
        user_id: number
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto, user_id} = params;
            const employee = await this.prisma.client.employee.findFirst({
                where: {
                    user_id
                }
            })
            const department = await this.prisma.departmentDocument.update({
                where,
                data: {...dto, department_id: employee.department_id},
                include: {
                    department: true
                },
            });

            return ResponseFormatter.success(
                "Department document updated successfully",
                department
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Department document already exist');
            }

            throw new InternalServerErrorException('Department document failed to update');
        }
    }

    // Delete department document in database
    async deleteDepartmentDocument(where: Prisma.DepartmentDocumentWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const departmentDocument = await this.prisma.client.departmentDocument.delete({
                id: where.id
            });

            const documentFilePath = path.join(__dirname, '../../assets/department_document', departmentDocument.document_file);
            if (fs.existsSync(documentFilePath)) {
              fs.unlinkSync(documentFilePath);
            }

            return ResponseFormatter.success(
                "Department document deleted successfully",
                departmentDocument
            );
        } catch (err) {
            throw new InternalServerErrorException('Department document failed to delete');
        }
    }
}

import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveDto } from './dto';

@Injectable()
export class LeaveService {
    constructor(private prisma: PrismaService) {}

    // Get all leaves
    async getAllLeave() : Promise<ResponseFormatter> {
        const leaves = await this.prisma.client.leave.findMany();

        return ResponseFormatter.success(
            "Leave fetched successfully",
            leaves
        );
    }

    // Get leave by id
    async getLeaveById(
        leaveWhereUniqueInput: Prisma.LeaveWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const leave = await this.prisma.client.leave.findUnique({
            where: leaveWhereUniqueInput,
        });

        return ResponseFormatter.success(
            "Leave fetched successfully",
            leave
        );
    }

    // Store leave to database
    async createLeave(dto: LeaveDto) : Promise<ResponseFormatter> {
        try {
            const existing = await this.prisma.leave.findFirst({
                where: {
                    leave_name: dto.leave_name,
                    deletedAt: null,
                },
            });

            if (existing) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Leave name already exists.',
                    error: 'Conflict',
                });
            }
            
            const leave = await this.prisma.leave.create({
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "Leave created successfully",
                leave,
                201
            );
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }

            if (err.code === 'P2002') {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Leave name already exists.',
                    error: 'Conflict',
                });
            }
    
            throw new InternalServerErrorException('Leave failed to create');
        }
    } 

    // Update leave in database
    async updateLeave(params: {
        where: Prisma.LeaveWhereUniqueInput;
        dto: LeaveDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;

            const existing = await this.prisma.leave.findFirst({
                where: {
                    leave_name: dto.leave_name,
                    deletedAt: null,
                },
            });

            if (existing) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Leave name already exists.',
                    error: 'Conflict',
                });
            }

            const leave = await this.prisma.leave.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Leave updated successfully",
                leave
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
            
            throw new InternalServerErrorException('Leave failed to update');
        }
    }

    // Delete leave in database
    async deleteLeave(where: Prisma.LeaveWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const leave = await this.prisma.client.leave.delete({
                id: where.id,
            });

            return ResponseFormatter.success(
                "Leave deleted successfully",
                leave
            );
        } catch (err) {
            throw new InternalServerErrorException('Leave failed to delete');
        }
    }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveDto } from './dto';

@Injectable()
export class LeaveService {
    constructor(private prisma: PrismaService) {}

    // Get all leaves
    async getAllLeave() : Promise<ResponseFormatter> {
        const leaves = await this.prisma.leave.findMany();

        return ResponseFormatter.success(
            "Leave fetched successfully",
            leaves
        );
    }

    // Get leave by id
    async getLeaveById(
        leaveWhereUniqueInput: Prisma.LeaveWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const leave = await this.prisma.leave.findUnique({
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
            if(err.code === 'P2002') {
                throw new BadRequestException('Leave already exist');
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
            const leave = await this.prisma.leave.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Leave updated successfully",
                leave
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Leave already exist');
            }

            throw new InternalServerErrorException('Leave failed to update');
        }
    }

    // Delete leave in database
    async deleteLeave(where: Prisma.LeaveWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const leave = await this.prisma.leave.delete({
                where,
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

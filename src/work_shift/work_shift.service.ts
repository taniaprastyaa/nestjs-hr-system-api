import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkShiftDto } from './dto';

@Injectable()
export class WorkShiftService {
    constructor(private prisma: PrismaService) {}

    // Get all work shifts
    async getAllWorkShift() : Promise<ResponseFormatter> {
        const workShifts = await this.prisma.workShift.findMany();

        return ResponseFormatter.success(
            "Work shift fetched successfully",
            workShifts
        );
    }

    // Get work shift by id
    async getWorkShiftById(
        workShiftWhereUniqueInput: Prisma.WorkShiftWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const workShift = await this.prisma.workShift.findUnique({
            where: workShiftWhereUniqueInput,
        });

        return ResponseFormatter.success(
            "Work shift fetched successfully",
            workShift
        );
    }

    // Store work shift to database
    async createWorkShift(dto: WorkShiftDto) : Promise<ResponseFormatter> {
        try {
            const workShift = await this.prisma.workShift.create({
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "WorkShift created successfully",
                workShift,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Work shift already exist');
            }
    
            throw new InternalServerErrorException('Work shift failed to create');
        }
    } 

    // Update work shift in database
    async updateWorkShift(params: {
        where: Prisma.WorkShiftWhereUniqueInput;
        dto: WorkShiftDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;
            const workShift = await this.prisma.workShift.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Work shift updated successfully",
                workShift
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Work shift already exist');
            }

            throw new InternalServerErrorException('Work shift failed to update');
        }
    }

    // Delete work shift in database
    async deleteWorkShift(where: Prisma.WorkShiftWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const workShift = await this.prisma.workShift.delete({
                where,
            });

            return ResponseFormatter.success(
                "Work shift deleted successfully",
                workShift
            );
        } catch (err) {
            throw new InternalServerErrorException('Work shift failed to delete');
        }
    }
}

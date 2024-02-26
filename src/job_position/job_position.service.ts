import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobPositionDto } from './dto';

@Injectable()
export class JobPositionService {
    constructor(private prisma: PrismaService) {}

    // Get all job positions
    async getAllJobPosition() : Promise<ResponseFormatter> {
        const jobPositions = await this.prisma.jobPosition.findMany();

        return ResponseFormatter.success(
            "JobPosition fetched successfully",
            jobPositions
        );
    }

    // Get job position by id
    async getJobPositionById(
        jobPositionWhereUniqueInput: Prisma.JobPositionWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const jobPosition = await this.prisma.jobPosition.findUnique({
            where: jobPositionWhereUniqueInput,
        });

        return ResponseFormatter.success(
            "JobPosition fetched successfully",
            jobPosition
        );
    }

    // Store job position to database
    async createJobPosition(dto: JobPositionDto) : Promise<ResponseFormatter> {
        try {
            const jobPosition = await this.prisma.jobPosition.create({
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "Job Position created successfully",
                jobPosition,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Job Position already exist');
            }
    
            throw new InternalServerErrorException('Job Position failed to create');
        }
    } 

    // Update job position in database
    async updateJobPosition(params: {
        where: Prisma.JobPositionWhereUniqueInput;
        dto: JobPositionDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;
            const jobPosition = await this.prisma.jobPosition.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Job Position updated successfully",
                jobPosition
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Job Position already exist');
            }

            throw new InternalServerErrorException('Job Position failed to update');
        }
    }

    // Delete job position in database
    async deleteJobPosition(where: Prisma.JobPositionWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const jobPosition = await this.prisma.jobPosition.delete({
                where,
            });

            return ResponseFormatter.success(
                "Job Position deleted successfully",
                jobPosition
            );
        } catch (err) {
            throw new InternalServerErrorException('Job Position failed to delete');
        }
    }
}

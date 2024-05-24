import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OvertimeService {
    constructor(private prisma: PrismaService) {}

    // Get all employee overtimes
    async getAllEmployeeOvertimes() : Promise<ResponseFormatter> {
        const overtimes = await this.prisma.overtime.findMany({
            include: {
                employee: true,
            }
        });

        return ResponseFormatter.success(
            "Overtime fetched successfully",
            overtimes
        );
    }

    // Get overtime by id
    async getOvertimeById(
        overtimeWhereUniqueInput: Prisma.OvertimeWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const overtime = await this.prisma.overtime.findUnique({
            where: overtimeWhereUniqueInput,
            include: {
                employee: true,
            }
        });

        return ResponseFormatter.success(
            " overtime fetched successfully",
            overtime
        );
    }
}

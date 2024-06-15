import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { HodOvertimeDto } from './dto';

@Injectable()
export class HodOvertimeService {
    constructor(private prisma: PrismaService) {}

    // Get all employee overtimes
    async getAllEmployeeOvertimes(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.client.employee.findFirst({
            where: {
                user_id
            },
            include: {
                department: true
            }
        });

        const hodOvertimes = await this.prisma.client.overtime.findMany({
            where: {
                employee: {
                    department: {
                        department_name: employee["department"].department_name
                    }
                }
            },
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "HodOvertime fetched successfully",
            hodOvertimes
        );
    }

    // Get Hodovertime by id
    async getHodOvertimeById(
        overtimeWhereUniqueInput: Prisma.OvertimeWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const hodOvertime = await this.prisma.client.overtime.findUnique({
            where: overtimeWhereUniqueInput,
            include: {
                employee: true
            }
        });

        return ResponseFormatter.success(
            "Hod overtime fetched successfully",
            hodOvertime
        );
    }

    // Update employee overtime in database
    async updateHodOvertime(params: {
        where: Prisma.OvertimeWhereUniqueInput;
        dto: HodOvertimeDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;

            const Hodovertime = await this.prisma.overtime.update({
                where,
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "Hod overtime updated successfully",
                Hodovertime
            );
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            throw new InternalServerErrorException('Hod overtime failed to update');
        }
    }
    
}

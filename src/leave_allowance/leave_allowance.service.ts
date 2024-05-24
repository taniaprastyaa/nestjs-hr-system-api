import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeaveAllowanceDto, UpdateLeaveAllowanceDto } from './dto';

@Injectable()
export class LeaveAllowanceService {
    constructor(private prisma: PrismaService) {}

    // Get all leave allowances
    async getAllLeaveAllowances() : Promise<ResponseFormatter> {
        const leaveAllowances = await this.prisma.leaveAllowance.findMany({
            include: {
                employee: true
            },
        });

        return ResponseFormatter.success(
            "Leave Allowance fetched successfully",
            leaveAllowances
        );
    }

    async getLeaveAllowancesPerDepartment(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.employee.findFirst({
            where: {
                user_id
            }
        });

        const leaveAllowances = await this.prisma.leaveAllowance.findMany({
            where: {
                employee: {
                    department_id: employee.department_id
                }
            },
            include: {
                employee: true
            }
        });        

        return ResponseFormatter.success(
            "Leave Allowance fetched successfully",
            leaveAllowances
        );
    }

    async getLeaveAllowancesPerEmployee(user_id: number) : Promise<ResponseFormatter> {
        const employee = await this.prisma.employee.findFirst({
            where: {
                user_id
            }
        });
        
        const leaveAllowances = await this.prisma.leaveAllowance.findMany({
            where: {
                employee_id: employee.id
            },
            include: {
                employee: true
            },
        });

        return ResponseFormatter.success(
            "Leave Allowance fetched successfully",
            leaveAllowances
        );
    }

    // Get leaveAllowance by id
    async getLeaveAllowanceById(
        leaveAllowanceWhereUniqueInput: Prisma.LeaveAllowanceWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const leaveAllowance = await this.prisma.leaveAllowance.findUnique({
            where: leaveAllowanceWhereUniqueInput,
            include: {
                employee: true
            },
        });

        return ResponseFormatter.success(
            "Leave Allowance fetched successfully",
            leaveAllowance
        );
    }

    // Store leaveAllowance to database
    @Cron('0 0 1 * *') // Run at midnight on the first day of each month
    async createLeaveAllowanceAutomatically(): Promise<void> {
      // Get all employees
      const employees = await this.prisma.employee.findMany();
  
      // Get the current year
      const currentYear = new Date().getFullYear().toString();
  
      // Iterate through each employee
      for (const employee of employees) {
        // Check if leave allowance entry exists for the current year
        const existingLeaveAllowance = await this.prisma.leaveAllowance.findFirst({
          where: {
            employee_id: employee.id,
            year: currentYear,
          },
        });
  
        // If no leave allowance entry for the current year, create one
        if (!existingLeaveAllowance) {
          await this.prisma.leaveAllowance.create({
            data: {
              leave_allowances: 12,
              year: currentYear,
              employee: {
                connect: {
                  id: employee.id,
                },
              },
            },
          });
        }
      }
    }

    // Update leaveAllowance in database
    async updateLeaveAllowance(params: {
        where: Prisma.LeaveAllowanceWhereUniqueInput;
        dto: UpdateLeaveAllowanceDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;
            console.log(dto);
            const leaveAllowance = await this.prisma.leaveAllowance.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Leave Allowance updated successfully",
                leaveAllowance
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Leave Allowance already exist');
            }

            throw new InternalServerErrorException('Leave Allowance failed to update');
        }
    }

    // Delete leaveAllowance in database
    async deleteLeaveAllowance(where: Prisma.LeaveAllowanceWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const leaveAllowance = await this.prisma.leaveAllowance.delete({
                where,
                include: {
                    employee: true
                },
            });

            return ResponseFormatter.success(
                "Leave Allowance deleted successfully",
                leaveAllowance
            );
        } catch (err) {
            throw new InternalServerErrorException('Leave Allowance failed to delete');
        }
    }
}

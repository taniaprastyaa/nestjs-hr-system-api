import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalarySlipDto } from './dto';
const logger = new Logger('EmployeeTaskService');

@Injectable()
export class SalarySlipService {
    constructor(private prisma: PrismaService) {}

    // Get all salarySlips
    async getAllSalarySlip(user_id: number) : Promise<ResponseFormatter> {
        const hod = await this.prisma.employee.findFirst({
            where: {
                user_id
            },
            include: {
                department: true
            }
        });

        const salarySlips = await this.prisma.salarySlip.findMany({
            where: {
                employee: {
                    department: {
                      department_name: hod["department"].department_name
                    }
                }
            }
        });

        return ResponseFormatter.success(
            "SalarySlip fetched successfully",
            salarySlips
        );
    }

    // Get salarySlip by id
    async getSalarySlipById(
        salarySlipWhereUniqueInput: Prisma.SalarySlipWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const salarySlip = await this.prisma.salarySlip.findUnique({
            where: salarySlipWhereUniqueInput,
        });

        return ResponseFormatter.success(
            "SalarySlip fetched successfully",
            salarySlip
        );
    }

    // Store salarySlip to database
    async generateSalarySlips(user_id: number): Promise<ResponseFormatter> {
        try {
            const hod = await this.prisma.employee.findFirst({
                where: {
                    user_id
                },
                include: {
                    department: true
                }
            });
            
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
            const year = currentDate.getFullYear();
        
            const employees = await this.prisma.employee.findMany({
                where: {
                    department: {
                        department_name: hod["department"].department_name
                    }
                }
            });
    
            for (const employee of employees) {
                const existingSlip = await this.prisma.salarySlip.findFirst({
                    where: {
                        employee_id: employee.id,
                        month,
                        year,
                    },
                });
        
                if (!existingSlip) {
                    const basicSalary = await this.getBasicSalary(employee.position_id);
                    const overtimePay = await this.calculateOvertimePay(employee.id, month, year);
                    const totalCuts = await this.calculateTotalCuts(employee.id, month, year, basicSalary);
                    const netSalary = basicSalary + overtimePay - totalCuts;
        
                    await this.prisma.salarySlip.create({
                        data: {
                        employee_id: employee.id,
                        month,
                        year,
                        basic_salary: basicSalary,
                        overtime: overtimePay,
                        total_cuts: totalCuts,
                        net_salary: netSalary,
                        },
                    });
                }
            }
    
            return ResponseFormatter.success(
                "Salary slips generated successfully",
                null,
                201
            );
        } catch (err) {
            logger.error('Error creating employee task:', err);

            throw new InternalServerErrorException('Failed to generate salary slips');
        }
    }
    
    async getBasicSalary(positionId: number): Promise<number> {
        const position = await this.prisma.jobPosition.findUnique({
          where: { id: positionId },
        });
        return position?.basic_salary || 0;
    }
    
    async calculateOvertimePay(employeeId: number, month: number, year: number): Promise<number> {
        const overtimeRate = 10000; // Overtime rate per hour
        const overtimes = await this.prisma.overtime.findMany({
          where: {
            employee_id: employeeId,
            date: {
              startsWith: `${year}-${String(month).padStart(2, '0')}`,
            },
          },
        });
    
        let totalOvertimePay = 0;
        for (const overtime of overtimes) {
          totalOvertimePay += overtime.duration * overtimeRate;
        }
    
        return totalOvertimePay;
    }
    
    async calculateTotalCuts(employeeId: number, month: number, year: number, basicSalary: number): Promise<number> {
        try {
          const unpaidLeaves = await this.prisma.leaveRequest.findMany({
            where: {
              employee_id: employeeId,
              status: 'Approved',
              leave: {
                type_of_leave: 'Unpaid',
              },
              start_date: {
                startsWith: `${year}-${String(month).padStart(2, '0')}`,
              },
            },
            include: {
              leave: true,
            },
          });
    
          let totalUnpaidLeaveValue = 0;
          for (const leave of unpaidLeaves) {
            totalUnpaidLeaveValue += leave.long_leave * leave["leave"].value;
          }
    
          const absences = await this.prisma.attendance.findMany({
            where: {
              employee_id: employeeId,
              status: 'Absent',
              date: {
                startsWith: `${year}-${String(month).padStart(2, '0')}`,
              },
            },
          });
    
          const totalAbsences = absences.length;
          const cutPerDay = basicSalary / 22;
          const absenceCuts = (totalUnpaidLeaveValue + totalAbsences) * cutPerDay;
    
          const attendances = await this.prisma.attendance.findMany({
            where: {
              employee_id: employeeId,
              status: 'Present',
              date: {
                startsWith: `${year}-${String(month).padStart(2, '0')}`,
              },
            },
          });
    
          let totalDelayMinutes = 0;
          for (const attendance of attendances) {
            totalDelayMinutes += attendance.delay_minutes || 0;
          }
    
          const delayUnit = 15;
          const delayRate = 5000;
          const delayCuts = Math.ceil(totalDelayMinutes / delayUnit) * delayRate;
    
          const totalCuts = absenceCuts + delayCuts;
    
          return totalCuts;
        } catch (err) {
          console.error('Error calculating total cuts:', err);
          throw new InternalServerErrorException('Failed to calculate total cuts');
        }
    }

    // Delete salarySlip in database
    async deleteSalarySlip(where: Prisma.SalarySlipWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const salarySlip = await this.prisma.salarySlip.delete({
                where,
            });

            return ResponseFormatter.success(
                "SalarySlip deleted successfully",
                salarySlip
            );
        } catch (err) {
            throw new InternalServerErrorException('SalarySlip failed to delete');
        }
    }
}

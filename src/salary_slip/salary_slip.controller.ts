import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { SalarySlipService } from "./salary_slip.service";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Salary Slip")
@Controller('salary_slip')
export class SalarySlipController{
    constructor(private salarySlipService: SalarySlipService) {}

    // Get all salary slips
    @ApiBearerAuth()
    @Get()
    getAllSalarySlips(
    ) : Promise<ResponseFormatter> {
        return this.salarySlipService.getAllSalarySlips();
    }

    @ApiBearerAuth()
    @Get('salary-slip-per-department')
    getAllSalarySlipsPerDepartment(
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.salarySlipService.getAllSalarySlipsPerDepartment(user_id);
    }

    @ApiBearerAuth()
    @Get('salary-slip-by-employee-id')
    getAllSalarySlipsByEmployeeId(
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.salarySlipService.getAllSalarySlipsByEmployeeId(user_id);
    }

    // Get salarySlip by id
    @ApiBearerAuth()
    @Get(':id')
    getSalarySlip(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.salarySlipService.getSalarySlipById({id: Number(id)});
    }

    // Store salarySlip to database
    @ApiBearerAuth()
    @Post()
    async createSalarySlip(
        @GetCurrentUserId() user_id: number
    ) {
        return this.salarySlipService.generateSalarySlips(user_id);
    }

    // Delete salarySlip in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteSalarySlip(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.salarySlipService.deleteSalarySlip({id: Number(id)});
    }
}
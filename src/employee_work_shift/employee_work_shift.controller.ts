import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { EmployeeWorkShiftService } from "./employee_work_shift.service";
import { EmployeeWorkShiftDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Employee Work Shift")
@Controller('employee_work_shifts')
export class EmployeeWorkShiftController{
    constructor(private employeeWorkShiftService: EmployeeWorkShiftService) {}

    // Get all employee work shifts
    @ApiBearerAuth()
    @Get()
    getAllEmployeeWorkShifts() : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.getAllEmployeeWorkShifts();
    }

    @ApiBearerAuth()
    @Get('employee-work-shift-per-department')
    getEmployeeWorkShiftsPerDepartment(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.getEmployeeWorkShiftsPerDepartment(user_id);
    }

    @ApiBearerAuth()
    @Get('employee-work-shift-by-id')
    getEmployeeWorkShift(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.getEmployeeWorkShift(user_id);
    }

    // Get employee work shift by id
    @ApiBearerAuth()
    @Get(':id')
    getmployeeWorkShift(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.getEmployeeWorkShiftById({id: Number(id)});
    }

    // Store employee work shift to database
    @ApiBearerAuth()
    @Post()
    async createEmployeeWorkShift(
        @Body() dto: EmployeeWorkShiftDto
    ) : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.createEmployeeWorkShift(dto);
    }

    // Update employee work shift in database
    @ApiBearerAuth()
    @Put(':id')
    async updateEmployeeWorkShift(
        @Param('id') id: string,
        @Body() dto: EmployeeWorkShiftDto
    ) : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.updateEmployeeWorkShift({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete employee work shift in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteEmployeeWorkShift(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.employeeWorkShiftService.deleteEmployeeWorkShift({id: Number(id)});
    }
}
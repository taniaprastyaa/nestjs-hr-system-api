import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { EmployeeOvertimeService } from "./employee_overtime.service";
import { EmployeeOvertimeDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Employee Overtime")
@Controller('employee_overtimes')
export class EmployeeOvertimeController{
    constructor(private overtimeService: EmployeeOvertimeService) {}

    // Get all overtimes
    @ApiBearerAuth()
    @Get()
    getAllEmployeeOvertimes() : Promise<ResponseFormatter> {
        return this.overtimeService.getAllEmployeeOvertime();
    }

    // Get employee overtime by id
    @ApiBearerAuth()
    @Get(':id')
    getEmployeeOvertime(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.overtimeService.getEmployeeOvertimeById({id: Number(id)});
    }

    // Store employee overtime to database
    @ApiBearerAuth()
    @Post()
    async createEmployeeOvertime(
        @Body() dto: EmployeeOvertimeDto,
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.overtimeService.createEmployeeOvertime(dto, user_id);
    }

    // Update employee overtime in database
    @ApiBearerAuth()
    @Put(':id')
    async updateEmployeeOvertime(
        @Param('id') id: string,
        @Body() dto: EmployeeOvertimeDto
    ) : Promise<ResponseFormatter> {
        return this.overtimeService.updateEmployeeOvertime({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete employee overtime in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteEmployeeOvertime(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.overtimeService.deleteEmployeeOvertime({id: Number(id)});
    }
}
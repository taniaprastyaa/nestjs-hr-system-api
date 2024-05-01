import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { LeaveRequestEmployeeService } from "./leave_request_employee.service";
import { LeaveRequestEmployeeDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Leave Request Employee")
@Controller('leave_request_employee')
export class LeaveRequestEmployeeController{
    constructor(private leaveRequestEmployeeService: LeaveRequestEmployeeService) {}

    // Get all deparments
    @ApiBearerAuth()
    @Get()
    async getAllLeaveRequestEmployee(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestEmployeeService.getEmployeeByUserId(user_id);
        return this.leaveRequestEmployeeService.getAllLeaveRequestEmployee(employee[0].id);
    }

    // Get leaveRequestEmployee by id
    @ApiBearerAuth()
    @Get(':id')
    async getLeaveRequestEmployee
    (
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.leaveRequestEmployeeService.getLeaveRequestEmployeeById({id: Number(id)});
    }

    // Store leaveRequestEmployee to database
    @ApiBearerAuth()
    @Post()
    async createLeaveRequestEmployee(
        @GetCurrentUserId() user_id: number,
        @Body() dto: LeaveRequestEmployeeDto
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestEmployeeService.getEmployeeByUserId(user_id);

        return this.leaveRequestEmployeeService.createLeaveRequestEmployee(dto, employee[0].id);
    }

    // Update leaveRequestEmployee in database
    @ApiBearerAuth()
    @Put(':id')
    async updateLeaveRequestEmployee(
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number,
        @Body() dto: LeaveRequestEmployeeDto
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestEmployeeService.getEmployeeByUserId(user_id);

        return this.leaveRequestEmployeeService.updateLeaveRequestEmployee(
            {id: Number(id)},
            dto
        );
    }

    // Delete leaveRequestEmployee in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteLeaveRequestEmployee(
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
                const employee = await this.leaveRequestEmployeeService.getEmployeeByUserId(user_id);

        return this.leaveRequestEmployeeService.deleteLeaveRequestEmployee({id: Number(id)});
    }
}
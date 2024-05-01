import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { LeaveRequestService } from "./leave_request_employee.service";
import { LeaveRequestDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Leave Request")
@Controller('leave_requests')
export class LeaveRequestController{
    constructor(private leaveRequestService: LeaveRequestService) {}

    // Get all deparments
    @ApiBearerAuth()
    @Get()
    async getAllLeaveRequest(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestService.getEmployeeByUserId(user_id);
        return this.leaveRequestService.getAllLeaveRequest(employee[0].id);
    }

    // Get leaveRequest by id
    @ApiBearerAuth()
    @Get(':id')
    async getLeaveRequest
    (
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestService.getEmployeeByUserId(user_id);
        return this.leaveRequestService.getLeaveRequestById({id: Number(id)});
    }

    // Store leaveRequest to database
    @ApiBearerAuth()
    @Post()
    async createLeaveRequest(
        @GetCurrentUserId() user_id: number,
        @Body() dto: LeaveRequestDto
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestService.getEmployeeByUserId(user_id);

        return this.leaveRequestService.createLeaveRequest(dto, employee[0].id);
    }

    // Update leaveRequest in database
    @ApiBearerAuth()
    @Put(':id')
    async updateLeaveRequest(
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number,
        @Body() dto: LeaveRequestDto
    ) : Promise<ResponseFormatter> {
        const employee = await this.leaveRequestService.getEmployeeByUserId(user_id);

        return this.leaveRequestService.updateLeaveRequest(
            {id: Number(id)},
            dto
        );
    }

    // Delete leaveRequest in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteLeaveRequest(
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
                const employee = await this.leaveRequestService.getEmployeeByUserId(user_id);

        return this.leaveRequestService.deleteLeaveRequest({id: Number(id)});
    }
}
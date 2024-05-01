import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { LeaveRequestHodService } from "./leave_request_hod.service";
import { LeaveRequestHodDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Leave Request HOD")
@Controller('leave_request_hod')
export class LeaveRequestHodController{
    constructor(private leaveRequestHodService: LeaveRequestHodService) {}

    // Get all leave request by hod department
    @ApiBearerAuth()
    @Get()
    async getAllLeaveRequest(
        @GetCurrentUserId() user_id: number,
    ) {
        const employee = await this.leaveRequestHodService.getEmployeeByUserId(user_id);
        return this.leaveRequestHodService.getAllLeaveRequest(employee[0].department.department_name);
    }

    // Get leaveRequest by id
    @ApiBearerAuth()
    @Get(':id')
    async getLeaveRequest
    (
        @Param('id') id: string
    ) : Promise<ResponseFormatter> {
        return this.leaveRequestHodService.getLeaveRequestById({id: Number(id)});
    }

    // Update leaveRequest in database
    @ApiBearerAuth()
    @Put(':id')
    async updateLeaveRequest(
        @Param('id') id: string,
        @Body() dto: LeaveRequestHodDto
    ) : Promise<ResponseFormatter> {
        return this.leaveRequestHodService.updateLeaveRequest(
            {id: Number(id)},
            dto
        );
    }
}
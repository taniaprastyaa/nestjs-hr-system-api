import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { LeaveRequestService } from "./leave_request.service";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Leave Request")
@Controller('leave_request')
export class LeaveRequestController{
    constructor(private leaveRequestHodService: LeaveRequestService) {}

    // Get all leave request by hod department
    @ApiBearerAuth()
    @Get()
    async getAllLeaveRequest(
    ) {
        return this.leaveRequestHodService.getAllLeaveRequest();
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
}
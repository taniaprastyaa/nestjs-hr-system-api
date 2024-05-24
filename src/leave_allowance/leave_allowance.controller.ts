import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { LeaveAllowanceService } from "./leave_allowance.service";
import { CreateLeaveAllowanceDto, UpdateLeaveAllowanceDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Leave Allowance")
@Controller('leave_allowance')
export class LeaveAllowanceController{
    constructor(private leaveAllowanceService: LeaveAllowanceService) {}

    // Get all leave allowances
    @ApiBearerAuth()
    @Get()
    getAllLeaveAllowances() : Promise<ResponseFormatter> {
        return this.leaveAllowanceService.getAllLeaveAllowances();
    }

    @ApiBearerAuth()
    @Get('leave-allowance-per-department')
    getLeaveAllowancesPerDepartment(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.leaveAllowanceService.getLeaveAllowancesPerDepartment(user_id);
    }

    @ApiBearerAuth()
    @Get('leave-allowance-per-employee')
    getLeaveAllowancesPerEmployee(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.leaveAllowanceService.getLeaveAllowancesPerEmployee(user_id);
    }

    // Get leaveAllowance by id
    @ApiBearerAuth()
    @Get(':id')
    getLeaveAllowance(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.leaveAllowanceService.getLeaveAllowanceById({id: Number(id)});
    }

    // Store leaveAllowance to database
    @ApiBearerAuth()
    @Post()
    async generateLeaveAllowance(): Promise<void> {
        await this.leaveAllowanceService.createLeaveAllowanceAutomatically();
    }

    // Update leaveAllowance in database
    @ApiBearerAuth()
    @Put(':id')
    async updateLeaveAllowance(
        @Param('id') id: string,
        @Body() dto: UpdateLeaveAllowanceDto
    ) : Promise<ResponseFormatter> {
        return this.leaveAllowanceService.updateLeaveAllowance({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete leaveAllowance in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteLeaveAllowance(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.leaveAllowanceService.deleteLeaveAllowance({id: Number(id)});
    }
}
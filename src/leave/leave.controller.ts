import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { LeaveService } from "./leave.service";
import { LeaveDto } from "./dto";

@ApiTags("Leave")
@Controller('leaves')
export class LeaveController{
    constructor(private leaveService: LeaveService) {}

    // Get all deparments
    @Get()
    getAllDeparments() : Promise<ResponseFormatter> {
        return this.leaveService.getAllLeave();
    }

    // Get leave by id
    @Get(':id')
    getLeave(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.leaveService.getLeaveById({id: Number(id)});
    }

    // Store leave to database
    @Post()
    async createLeave(
        @Body() dto: LeaveDto
    ) : Promise<ResponseFormatter> {
        return this.leaveService.createLeave(dto);
    }

    // Update leave in database
    @Put(':id')
    async updateLeave(
        @Param('id') id: string,
        @Body() dto: LeaveDto
    ) : Promise<ResponseFormatter> {
        return this.leaveService.updateLeave({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete leave in database
    @Delete(':id')
    async deleteLeave(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.leaveService.deleteLeave({id: Number(id)});
    }
}
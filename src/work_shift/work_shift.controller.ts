import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { WorkShiftService } from "./work_shift.service";
import { WorkShiftDto } from "./dto";

@ApiTags("Work Shift")
@Controller('work_shifts')
export class WorkShiftController{
    constructor(private workShiftService: WorkShiftService) {}

    // Get all work shifts
    @Get()
    getAllDeparments() : Promise<ResponseFormatter> {
        return this.workShiftService.getAllWorkShift();
    }

    // Get work shift by id
    @Get(':id')
    getWorkShift(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.workShiftService.getWorkShiftById({id: Number(id)});
    }

    // Store work shift to database
    @Post()
    async createWorkShift(
        @Body() dto: WorkShiftDto
    ) : Promise<ResponseFormatter> {
        return this.workShiftService.createWorkShift(dto);
    }

    // Update work shift in database
    @Put(':id')
    async updateWorkShift(
        @Param('id') id: string,
        @Body() dto: WorkShiftDto
    ) : Promise<ResponseFormatter> {
        return this.workShiftService.updateWorkShift({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete work shift in database
    @Delete(':id')
    async deleteWorkShift(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.workShiftService.deleteWorkShift({id: Number(id)});
    }
}
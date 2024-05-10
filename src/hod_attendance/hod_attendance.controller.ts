import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { HodAttendanceService } from "./hod_attendance.service";
import { UpdateAttendanceDto } from "./dto";

@ApiTags("HOD Attendance")
@Controller('hod_attendances')
export class HodAttendanceController{
    constructor(private hodAttendanceService: HodAttendanceService) {}

    // Get all attendances by employee id
    @ApiBearerAuth()
    @Get()
    getAllAttendances(
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.hodAttendanceService.getAllAttendance(user_id);
    }

    // Get attendance by id
    @ApiBearerAuth()
    @Get(':id')
    getAttendance(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.hodAttendanceService.getAttendanceById({id: Number(id)});
    }

    // Store attendance to database
    @ApiBearerAuth()
    @Post()
    async createAttendance(
        @GetCurrentUserId() user_id: number,
    ){
        return this.hodAttendanceService.checkMissingAttendance(user_id);
    }

    // Update attendance in database
    @ApiBearerAuth()
    @Put(':id')
    async updateAttendance(
        @Param('id') id: string,
        @Body() dto: UpdateAttendanceDto
    ) : Promise<ResponseFormatter> {
        return this.hodAttendanceService.updateAttendance({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete attendance in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteAttendance(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.hodAttendanceService.deleteAttendance({id: Number(id)});
    }
}
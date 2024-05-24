import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { AttendanceService } from "./attendance.service";

@ApiTags("Attendance")
@Controller('attendances')
export class AttendanceController{
    constructor(private attendanceService: AttendanceService) {}

    // Get all attendances by employee id
    @ApiBearerAuth()
    @Get()
    getAllAttendances(
    ) : Promise<ResponseFormatter> {
        return this.attendanceService.getAllAttendance();
    }

    // Get attendance by id
    @ApiBearerAuth()
    @Get(':id')
    getAttendance(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.attendanceService.getAttendanceById({id: Number(id)});
    }

}
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { EmployeeAttendanceService } from "./employee_attendance.service";
import { EmployeeAttendanceDto } from "./dto";

@ApiTags("Employee Attendance")
@Controller('employee_attendances')
export class EmployeeAttendanceController{
    constructor(private attendanceService: EmployeeAttendanceService) {}

    // Get all attendances by employee id
    @ApiBearerAuth()
    @Get()
    getAllAttendances(
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.attendanceService.getAllAttendance(user_id);
    }

    // Get attendance by id
    @ApiBearerAuth()
    @Get(':id')
    getAttendance(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.attendanceService.getAttendanceById({id: Number(id)});
    }

    // Store attendance to database
    @ApiBearerAuth()
    @Post()
    async createAttendance(
        @Body() dto: EmployeeAttendanceDto,
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.attendanceService.createAttendance(dto, user_id);
    }
}
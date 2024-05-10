import { ApiProperty } from "@nestjs/swagger";
import { AttendanceStatus } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EmployeeAttendanceDto {
    @ApiProperty({
        description: "The attendance status of the attendance",
        enum: ['Present', 'Absent'],
    })
    @IsString()
    @IsNotEmpty()
    status: AttendanceStatus
}
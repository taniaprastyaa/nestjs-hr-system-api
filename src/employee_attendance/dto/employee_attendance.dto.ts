import { ApiProperty } from "@nestjs/swagger";
import { AttendanceStatus } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EmployeeAttendanceDto {
    @ApiProperty({
        description: "The time in of the attendance",
        example: "22:20",
    })
    @IsString()
    @IsOptional()
    time_in?: string

    @ApiProperty({
        description: "The time out of the attendance",
        example: "24:00",
    })
    @IsString()
    @IsOptional()
    time_out?: string

    @ApiProperty({
        description: "The attendance status of the attendance",
        enum: ['Present', 'Absent', 'Leave'],
    })
    @IsString()
    @IsNotEmpty()
    status: AttendanceStatus
}
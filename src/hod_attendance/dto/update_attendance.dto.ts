import { ApiProperty } from "@nestjs/swagger";
import { AttendanceStatus } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAttendanceDto {
    @ApiProperty({
        description: "The date of the attendance",
        example: "2024-05-10",
    })
    @IsString()
    @IsNotEmpty()
    date: string

    @ApiProperty({
        description: "The time in of the attendance",
        example: "08:00",
    })
    @IsString()
    @IsOptional()
    time_in: string

    @ApiProperty({
        description: "The time out of the attendance",
        example: "17:00",
    })
    @IsString()
    @IsOptional()
    time_out: string

    @ApiProperty({
        description: "The time out of the attendance",
        enum: ['Present', 'Absent', 'Leave', 'Half_day_leave'],
    })
    @IsString()
    @IsNotEmpty()
    status: AttendanceStatus

    @ApiProperty({
        description: "The employee id of the attendance",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_id: number
}
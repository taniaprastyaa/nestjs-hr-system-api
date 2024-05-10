import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LeaveRequestEmployeeDto {
    @ApiProperty({
        description: "The start date of the leave request",
        example: "2024-04-12",
    })
    @IsString()
    @IsNotEmpty()
    start_date: string

    @ApiProperty({
        description: "The end date of the leave request",
        example: "2024-04-12",
    })
    @IsString()
    @IsNotEmpty()
    end_date: string

    @ApiProperty({
        description: "The start time of half day leave",
        example: "13:00",
    })
    @IsString()
    @IsOptional()
    start_time?: string

    @ApiProperty({
        description: "The end time of the half day leave",
        example: "17:00",
    })
    @IsString()
    @IsOptional()
    end_time?: string

    @ApiProperty({
        description: "The message of the leave request",
        example: "This is the message of the leave request",
    })
    @IsString()
    @IsNotEmpty()
    message: string

    @ApiProperty({
        description: "The leave id of the leave request",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    leave_id: number
}
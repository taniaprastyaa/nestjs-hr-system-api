import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EmployeeOvertimeDto {
    @ApiProperty({
        description: "The date of the employee overtime",
        example: "2024-05-10",
    })
    @IsString()
    @IsNotEmpty()
    date: string

    @ApiProperty({
        description: "The start time of the employee overtime",
        example: "19:00",
    })
    @IsString()
    @IsNotEmpty()
    start_time: string

    @ApiProperty({
        description: "The end time of the employee overtime",
        example: "21:00",
    })
    @IsString()
    @IsNotEmpty()
    end_time: string

    @ApiProperty({
        description: "The reason of the employee overtime",
        example: "This is the reason of the employee overtime",
    })
    @IsString()
    @IsNotEmpty()
    reason: string
}
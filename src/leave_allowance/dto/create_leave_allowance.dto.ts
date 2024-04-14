import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLeaveAllowanceDto {
    @ApiProperty({
        description: "The employee id of the leave allowance",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_id: number

    @ApiProperty({
        description: "The year of the leave allowance",
        example: "2024",
    })
    @IsString()
    @IsNotEmpty()
    year: string
}
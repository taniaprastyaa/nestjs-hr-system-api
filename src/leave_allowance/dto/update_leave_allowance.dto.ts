import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateLeaveAllowanceDto {
    @ApiProperty({
        description: "The employee id of the leave allowance",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_id: number

    @ApiProperty({
        description: "The number of leave allowances",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    leave_allowances: number

    @ApiProperty({
        description: "The year of the leave allowance",
        example: "2024",
    })
    @IsString()
    @IsNotEmpty()
    year: string
}
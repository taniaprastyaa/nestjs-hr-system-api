import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SalarySlipDto {
    @ApiProperty({
        description: "The month of the salary slip",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    month: number

    @ApiProperty({
        description: "The year of the salary slip",
        example: 2024,
    })
    @IsNumber()
    @IsNotEmpty()
    year: number

    @ApiProperty({
        description: "The basic salary of the employee",
        example: 15000000,
    })
    @IsNumber()
    @IsNotEmpty()
    basic_salary: number

    @ApiProperty({
        description: "The overtime pay of the employee",
        example: 500000,
    })
    @IsNumber()
    @IsNotEmpty()
    overtime: number

    @ApiProperty({
        description: "The total cuts of the employee",
        example: 50000,
    })
    @IsNumber()
    @IsNotEmpty()
    total_cuts: number

    @ApiProperty({
        description: "The net salary of the employee",
        example: 15450000,
    })
    @IsNumber()
    @IsNotEmpty()
    net_salary: number
}
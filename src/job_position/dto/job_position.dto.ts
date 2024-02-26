import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class JobPositionDto {
    @ApiProperty({
        description: "The name of the job position",
        example: "Position",
    })
    @IsString()
    @IsNotEmpty()
    position_name: string

    @ApiProperty({
        description: "The description of the job position",
        example: "This is job position description",
    })
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({
        description: "The basic salary of the job position",
        example: 1000000,
    })
    @IsNumber()
    @IsNotEmpty()
    basic_salary: number
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LeaveRequestDto {
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
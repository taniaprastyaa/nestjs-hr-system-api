import { ApiProperty } from "@nestjs/swagger";
import { TypeOfLeave } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LeaveDto {
    @ApiProperty({
        description: "The name of the leave",
        example: "Sick",
    })
    @IsString()
    @IsNotEmpty()
    leave_name: string

    @ApiProperty({
        description: "The type of leave",
        enum: ['Paid', 'Unpaid']
    })
    @IsString()
    @IsNotEmpty()
    type_of_leave: TypeOfLeave

    @ApiProperty({
        description: "The value of the leave",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    value: number
}
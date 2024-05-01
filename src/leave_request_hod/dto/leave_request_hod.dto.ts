import { ApiProperty } from "@nestjs/swagger";
import { LeaveStatus } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LeaveRequestHodDto {
    @ApiProperty({
        description: "The status of the leave request",
        enum: ['Approved', 'Rejected'],
    })
    @IsString()
    @IsNotEmpty()
    status: LeaveStatus
}
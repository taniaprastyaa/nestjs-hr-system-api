import { ApiProperty } from "@nestjs/swagger";
import { OvertimeStatus } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class HodOvertimeDto {
    @ApiProperty({
        description: "The status of the employee overtime",
        enum: ['Approved', 'Rejected'],
    })
    @IsString()
    @IsNotEmpty()
    status: OvertimeStatus
}
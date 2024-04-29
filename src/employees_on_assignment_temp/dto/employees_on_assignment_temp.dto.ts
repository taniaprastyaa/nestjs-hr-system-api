import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class EmployeesOnAssignmentTempDto {
    @ApiProperty({
        description: "The employee id of the employee task assignment",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_id: number
}
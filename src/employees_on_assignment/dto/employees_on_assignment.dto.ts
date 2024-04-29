import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { IsNotEmpty, IsNumber} from "class-validator";

export class EmployeesOnAssignmentDto {
    @ApiProperty({
        description: "The employee id of the employee task assignment",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_id: number

    @ApiProperty({
        description: "The employee task id of the employee task assignment",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    employee_task_id: number
}
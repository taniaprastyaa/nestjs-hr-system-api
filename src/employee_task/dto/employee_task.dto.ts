import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class ChecklistItem {
  @ApiProperty({ example: "Review code" })
  @IsString()
  title: string;

  @ApiProperty({ example: true })
  @IsOptional()
  done?: boolean;
}

export class EmployeeTaskDto {
    @ApiProperty({
        description: "The task title of the employee task",
        example: "Task Title",
    })
    @IsString()
    @IsNotEmpty()
    task_title: string

    @ApiProperty({
        description: "The description of the employee task",
        example: "This is employee task description",
    })
    @IsString()
    @IsNotEmpty()
    task_description: string

    @ApiProperty({
        description: "The deadline of the employee task",
        example: "2023-10-25T15:50:23.350Z",
    })
    @IsString()
    @IsNotEmpty()
    deadline: string;

    @ApiProperty({
        description: "The status of the employee",
        enum: ['Not_Started', 'Paused', 'In_Progress', 'Done', 'Canceled'],
    })
    @IsString()
    @IsNotEmpty()
    status: TaskStatus

    @ApiProperty({
        description: "The department of the employee task",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    department_id: number

    @ApiProperty({
        description: "The task priority of the employee task",
        enum: ['High', 'Medium', 'Low'],
    })
    @IsString()
    @IsNotEmpty()
    priority: TaskPriority

    @ApiProperty({
        description: "The date the task was completed",
        example: "2024-04-12T06:21:50.923Z",
    })
    @IsString()
    @IsOptional()
    completedAt?: string

    @ApiProperty({
        description: "The notes of the employee task",
        example: "This is notes employee task description",
    })
    @IsString()
    @IsOptional()
    notes?: string

    @ApiProperty({
        description: "The notes of the employee task",
        example: "https://drive.google.com/file/d/your_file_id_here/view?usp=sharing",
    })
    @IsString()
    @IsOptional()
    attachment?: string

    @ApiProperty({ type: [ChecklistItem], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChecklistItem)
    @IsOptional()
    checklist?: ChecklistItem[];

    @ApiProperty({
        description: "List of employee IDs assigned to the task",
        example: [1, 2, 3],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    employee_on_assignment_ids: number[]
}
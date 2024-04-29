import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { EmployeesOnAssignmentService } from "./employees_on_assigment.service";
import {EmployeesOnAssignmentDto} from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Employees on Assignment")
@Controller('employees_on_assignment')
export class EmployeesOnAssignmentController{
    constructor(private employeesOnAssignmentService: EmployeesOnAssignmentService) {}

    // Get all employees on assignment
    @ApiBearerAuth()
    @Get(':employee_task_id')
    getAllEmployeesOnAssignment(
        @Param('employee_task_id') employee_task_id: string
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentService.getAllEmployeesOnAssignment(Number(employee_task_id));
    }

    // Store employees on assignment 
    @ApiBearerAuth()
    @Post()
    async createEmployeeOnAssignment(
        @Body() dto:EmployeesOnAssignmentDto
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentService.createEmployeeOnAssignment(dto);
    }

    // Delete employee on assignment by id
    @ApiBearerAuth()
    @Delete(':id')
    async deleteEmployeeOnAssignmentById(
        @Param('id') id: string
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentService.deleteEmployeeOnAssignmentById({id: Number(id)});
    }
}
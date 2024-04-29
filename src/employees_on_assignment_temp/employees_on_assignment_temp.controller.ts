import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { EmployeesOnAssignmentTempService } from "./employees_on_assigment_temp.service";
import {EmployeesOnAssignmentTempDto} from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Employees on Assignment Temp")
@Controller('employees_on_assignment_temp')
export class EmployeesOnAssignmentTempController{
    constructor(private employeesOnAssignmentTempService: EmployeesOnAssignmentTempService) {}

    // Get all employees on assignment
    @ApiBearerAuth()
    @Get()
    getAllEmployeesOnAssignment(
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentTempService.getAllEmployeesOnAssignment(user_id);
    }

    // Get employees on assigment by id
    @ApiBearerAuth()
    @Get(':id')
    getEmployeeOnAssignment(@Param('id') id: string) : Promise<ResponseFormatter> {
        console.log(id);
        return this.employeesOnAssignmentTempService.getEmployeeOnAssignmentById({id: Number(id)});
    }

    // Store employees on assignment 
    @ApiBearerAuth()
    @Post()
    async createEmployeeOnAssignment(
        @Body() dto:EmployeesOnAssignmentTempDto,
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentTempService.createEmployeeOnAssignment(dto, user_id);
    }

    // Delete employee on assignment by id
    @ApiBearerAuth()
    @Delete(':employee_id')
    async deleteEmployeeOnAssignmentByEmployeeId(
        @Param('employee_id') employee_id: string,
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentTempService.deleteEmployeeOnAssignmentByEmployeeId(Number(employee_id), user_id);
    }

    // Delete all employees on assignment
    @ApiBearerAuth()
    @Delete()
    async deleteAllEmployeesOnAssignment(
        @GetCurrentUserId() user_id: number
    ) : Promise<ResponseFormatter> {
        return this.employeesOnAssignmentTempService.deleteAllEmployeesOnAssignment(user_id);
    }
}
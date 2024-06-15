import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { EmployeeTaskService } from "./employee_task.service";
import { EmployeeTaskDto } from "./dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Employee Task")
@Controller('employee_tasks')
export class EmployeeTaskController{
    constructor(private employeeTaskService: EmployeeTaskService) {}

    // Get all employee task
    @ApiBearerAuth()
    @Get()
    getAllEmployeeTasks() : Promise<ResponseFormatter> {
        return this.employeeTaskService.getAllEmployeeTasks();
    }

    @ApiBearerAuth()
    @Get('employee-task-per-department')
    getEmployeeTasksPerDepartment(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.employeeTaskService.getEmployeeTasksPerDepartment(user_id);
    }

    @ApiBearerAuth()
    @Get('employee-task-per-employee')
    getEmployeeTasks(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.employeeTaskService.getEmployeeTasks(user_id);
    }

    // Get employee task by id
    @ApiBearerAuth()
    @Get(':id')
    getEmployeeTask(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.employeeTaskService.getEmployeeTaskById({id: Number(id)});
    }

    // Store employee task to database
    @ApiBearerAuth()
    @Post()
    async createEmployeeTask(
        @GetCurrentUserId() user_id: number,
        @Body() dto: EmployeeTaskDto
    ) {
        return this.employeeTaskService.createEmployeeTask(user_id, dto);

    }

    // Update employee task in database
    @ApiBearerAuth()
    @Put(':id')
    async updateEmployeeTask(
        @Param('id') id: string,
        @GetCurrentUserId() user_id: number,
        @Body() dto: EmployeeTaskDto
    ) : Promise<ResponseFormatter> {
        return this.employeeTaskService.updateEmployeeTask({
            where: {id: Number(id)},
            dto,
            user_id: user_id
        })
    }

    // Delete employee task in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteEmployeeTask(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.employeeTaskService.deleteEmployeeTask({id: Number(id)});
    }
}
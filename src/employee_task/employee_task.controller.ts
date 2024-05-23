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
        const employeesOnAssignment = await this.employeeTaskService.getAllEmployeesOnAssignment(user_id);

        if (!employeesOnAssignment) {
            throw new BadRequestException('Employee is still empty, please add employee first');
        }

        const employeeTask = await this.employeeTaskService.createEmployeeTask(user_id, dto);

        if(employeeTask) {
            let allAddedSuccessfully = true;
    
            for (const employeeOnAssignment of employeesOnAssignment) {
                try {
                    await this.employeeTaskService.addEmployeesOnAssignment(
                        employeeOnAssignment.employee_id,
                        employeeTask.id,                        
                    );
                } catch (err) {
                    console.error('Error adding transaction detail:', err);
                    allAddedSuccessfully = false;
                    break;
                }
            }
    
            if (allAddedSuccessfully) {
                const employeesOnAssignmentTemp = await this.employeeTaskService.clearEmployeesOnAssignmentTemp(user_id);
                return employeeTask;
            } else {
                throw new InternalServerErrorException('Failed to add some employees to employees on assignment');
            }
        } else {
            throw new InternalServerErrorException('Employee task failed to create');
        }
    }

    // Update employee task in database
    @ApiBearerAuth()
    @Put(':id')
    async updateEmployeeTask(
        @Param('id') id: string,
        @Body() dto: EmployeeTaskDto
    ) : Promise<ResponseFormatter> {
        return this.employeeTaskService.updateEmployeeTask({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete employee task in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteEmployeeTask(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.employeeTaskService.deleteEmployeeTask({id: Number(id)});
    }
}
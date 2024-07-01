import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

@ApiTags("Employee")
@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService : EmployeeService) {}

    @ApiBearerAuth()
    @Get('statistics')
    getStatistics(
        @GetCurrentUserId() user_id: number,
    ) {
      return this.employeeService.getStatistics(user_id);
    }

    // Get all employees
    @ApiBearerAuth()
    @Get()
    getAllEmployees(
    ): Promise<ResponseFormatter> {
        return this.employeeService.getAllEmployees();
    }

    @ApiBearerAuth()
    @Get('employee-per-department')
    getAllEmployeesPerDepartment(
        @GetCurrentUserId() user_id: number,
    ): Promise<ResponseFormatter> {
        return this.employeeService.getAllEmployeesPerDepartment(user_id);
    }

    // Get employee by id
    @ApiBearerAuth()
    @Get(':id')
    getSubject(@Param('id') id: string): Promise<ResponseFormatter> {
        return this.employeeService.getEmployeeById({id: Number(id)});
    }

    // Store employee to database
    @ApiBearerAuth()
    @Post()
    async createEmployee(
        @Body() dto: CreateEmployeeDto
    ): Promise<ResponseFormatter>{
        return this.employeeService.createEmployee(dto);
    }

    // Update employee in database
    @ApiBearerAuth()
    @Put(':id')
    async updateEmployee(
        @Param('id') id: string,
        @Body() dto: UpdateEmployeeDto
    ) {
        return this.employeeService.updateEmployee({where: {id: Number(id)}, dto})
    }

    // Delete subject in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteEmployee(@Param('id') id: string): Promise<ResponseFormatter> {
        return this.employeeService.deleteEmployee({id: Number(id) });
    }
}

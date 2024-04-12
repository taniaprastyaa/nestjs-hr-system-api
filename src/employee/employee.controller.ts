import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@ApiTags("Employee")
@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService : EmployeeService) {}

    // Get all employees
    @ApiBearerAuth()
    @Get()
    getAllEmployees(): Promise<ResponseFormatter> {
        return this.employeeService.getAllEmployees();
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

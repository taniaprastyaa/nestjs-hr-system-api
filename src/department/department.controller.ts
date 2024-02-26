import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { DepartmentService } from "./department.service";
import { DepartmentDto } from "./dto";

@ApiTags("Department")
@Controller('departments')
export class DepartmentController{
    constructor(private departmentService: DepartmentService) {}

    // Get all deparments
    @Get()
    getAllDeparments() : Promise<ResponseFormatter> {
        return this.departmentService.getAllDepartment();
    }

    // Get department by id
    @Get(':id')
    getDepartment(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.departmentService.getDepartmentById({id: Number(id)});
    }

    // Store department to database
    @Post()
    async createDepartment(
        @Body() dto: DepartmentDto
    ) : Promise<ResponseFormatter> {
        return this.departmentService.createDepartment(dto);
    }

    // Update department in database
    @Put(':id')
    async updateDepartment(
        @Param('id') id: string,
        @Body() dto: DepartmentDto
    ) : Promise<ResponseFormatter> {
        return this.departmentService.updateDepartment({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete department in database
    @Delete(':id')
    async deleteDepartment(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.departmentService.deleteDepartment({id: Number(id)});
    }
}
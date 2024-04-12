import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { JobPositionService } from "./job_position.service";
import { JobPositionDto } from "./dto";

@ApiTags("Job Position")
@Controller('job_positions')
export class JobPositionController{
    constructor(private jobPositionService: JobPositionService) {}

    // Get all job position
    @Get()
    @ApiBearerAuth()
    getAllJobPosition() : Promise<ResponseFormatter> {
        return this.jobPositionService.getAllJobPosition();
    }

    // Get job position by id
    @ApiBearerAuth()
    @Get(':id')
    getJobPosition(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.jobPositionService.getJobPositionById({id: Number(id)});
    }

    // Store job position to database
    @ApiBearerAuth()
    @Post()
    async createJobPosition(
        @Body() dto: JobPositionDto
    ) : Promise<ResponseFormatter> {
        return this.jobPositionService.createJobPosition(dto);
    }

    // Update job position in database
    @ApiBearerAuth()
    @Put(':id')
    async updateJobPosition(
        @Param('id') id: string,
        @Body() dto: JobPositionDto
    ) : Promise<ResponseFormatter> {
        return this.jobPositionService.updateJobPosition({
            where: {id: Number(id)},
            dto
        })
    }

    // Delete job position in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteJobPosition(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.jobPositionService.deleteJobPosition({id: Number(id)});
    }
}
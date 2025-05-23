import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { ResponseFormatter } from "src/helpers/response.formatter";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementDto } from "./dto";

@ApiTags("Announcement")
@Controller('announcements')
export class AnnouncementController{
    constructor(private announcementService: AnnouncementService) {}

    // Get all announcement
    @ApiBearerAuth()
    @Get()
    getAllAnnouncements(
    ) : Promise<ResponseFormatter> {
        return this.announcementService.getAllAnnouncements();
    }

    @ApiBearerAuth()
    @Get('announcement-per-department')
    getAllAnnouncementsPerDepartment(
        @GetCurrentUserId() user_id: number,
    ) : Promise<ResponseFormatter> {
        return this.announcementService.getAllAnnouncementsPerDepartment(user_id);
    }

    // Get announcement by id
    @ApiBearerAuth()
    @Get(':id')
    getAnnouncement(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.announcementService.getAnnouncementById({id: Number(id)});
    }

    // Store announcement to database
    @ApiBearerAuth()
    @Post()
    async createAnnouncement(
        @GetCurrentUserId() userId: number,
        @Body() dto: AnnouncementDto,
    ) : Promise<ResponseFormatter> {
        return this.announcementService.createAnnouncement(dto, userId);
    }

    // Update announcement in database
    @ApiBearerAuth()
    @Put(':id')
    async updateAnnouncement(
        @Param('id') id: string,
        @GetCurrentUserId() userId: number,
        @Body() dto: AnnouncementDto
    ) : Promise<ResponseFormatter> {
        return this.announcementService.updateAnnouncement({
            where: {id: Number(id)},
            dto,
            user_id: userId
        })
    }

    // Delete announcement in database
    @ApiBearerAuth()
    @Delete(':id')
    async deleteAnnouncement(@Param('id') id: string) : Promise<ResponseFormatter> {
        return this.announcementService.deleteAnnouncement({id: Number(id)});
    }
}
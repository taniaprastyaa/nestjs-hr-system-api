import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnnouncementDto } from './dto';

@Injectable()
export class AnnouncementService {
    constructor(private prisma: PrismaService) {}

    // Get all announcements
    async getAllAnnouncement() : Promise<ResponseFormatter> {
        const generalAnnouncements = await this.prisma.announcement.findMany({
            where: {
                department_id: null
            }
        });

        const departmentAnnouncements = await this.prisma.announcement.findMany({
            where: {
                department_id: {
                    not: null
                }
            },
            include: {
                department: true,
            },
        });

        const announcements = [generalAnnouncements, departmentAnnouncements]

        return ResponseFormatter.success(
            "Announcement fetched successfully",
            announcements
        );
    }

    // Get announcement by id
    async getAnnouncementById(
        announcementWhereUniqueInput: Prisma.AnnouncementWhereUniqueInput,
    ) : Promise<ResponseFormatter> {
        const announcement = await this.prisma.announcement.findUnique({
            where: announcementWhereUniqueInput,
            include: {
                department: true,
            },
        });

        return ResponseFormatter.success(
            "Announcement fetched successfully",
            announcement
        );
    }

    // Store announcement to database
    async createAnnouncement(dto: AnnouncementDto) : Promise<ResponseFormatter> {
        try {
            dto.department_id = (dto.department_id === 0) ? null : dto.department_id;
            const announcement = await this.prisma.announcement.create({
                data: {
                    ...dto,
                }
            });

            return ResponseFormatter.success(
                "Announcement created successfully",
                announcement,
                201
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Announcement already exist');
            }
    
            throw new InternalServerErrorException('Announcement failed to create');
        }
    } 

    // Update announcement in database
    async updateAnnouncement(params: {
        where: Prisma.AnnouncementWhereUniqueInput;
        dto: AnnouncementDto;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto} = params;
            dto.department_id = (dto.department_id === 0) ? null : dto.department_id;
            const announcement = await this.prisma.announcement.update({
                where,
                data: {...dto,}
            });

            return ResponseFormatter.success(
                "Announcement updated successfully",
                announcement
            );
        } catch (err) {
            if(err.code === 'P2002') {
                throw new BadRequestException('Announcement already exist');
            }

            throw new InternalServerErrorException('Announcement failed to update');
        }
    }

    // Delete announcement in database
    async deleteAnnouncement(where: Prisma.AnnouncementWhereUniqueInput) : Promise<ResponseFormatter> {
        try {
            const announcement = await this.prisma.announcement.delete({
                where,
            });

            return ResponseFormatter.success(
                "Announcement deleted successfully",
                announcement
            );
        } catch (err) {
            throw new InternalServerErrorException('Announcement failed to delete');
        }
    }
}

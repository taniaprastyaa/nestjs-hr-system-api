import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseFormatter } from 'src/helpers/response.formatter';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnnouncementDto } from './dto';

@Injectable()
export class AnnouncementService {
    constructor(private prisma: PrismaService) {}

    // Get all announcements
    async getAllAnnouncements() : Promise<ResponseFormatter> {
        const announcements = await this.prisma.client.announcement.findMany({
            include: {
                department: true,
            },
        });

        return ResponseFormatter.success(
            "Announcement fetched successfully",
            announcements
        );
    }

    async getAllAnnouncementsPerDepartment(user_id: number) : Promise<ResponseFormatter> {
        const generalAnnouncements = await this.prisma.client.announcement.findMany({
            where: {
                department_id: null
            }
        });

        const employee = await this.prisma.client.employee.findMany({
            where: {
                user_id 
            },
            include: {
                department: true
            }
        });

        const department = employee[0]["department"]["department_name"];

        const departmentAnnouncements = await this.prisma.client.announcement.findMany({
            where: {
                department_id: {
                    not: null,
                },
                department: {
                    department_name: department
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
        const announcement = await this.prisma.client.announcement.findUnique({
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
    async createAnnouncement(dto: AnnouncementDto, user_id: number) : Promise<ResponseFormatter> {
        try {
            const employee = await this.prisma.client.employee.findFirst({
                where: {
                    user_id
                }
            });

            let department_id = null;
            
            if(dto["announcement_type"] === "per_department"){
                department_id = employee.department_id;
            }

            const announcement = await this.prisma.announcement.create({
                data: {
                    ...dto,
                    department_id
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
        user_id: number;
    }) : Promise<ResponseFormatter> {
        try {
            const {where, dto, user_id} = params;

            const employee = await this.prisma.client.employee.findFirst({
                where: {
                    user_id
                }
            });

            let department_id = null;
            
            if(dto["announcement_type"] === "per_department"){
                department_id = employee.department_id;
            }

            const announcement = await this.prisma.announcement.update({
                where,
                data: {
                    ...dto,
                    department_id
                }
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
            const announcement = await this.prisma.client.announcement.delete({
                id: where.id,
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

-- AlterTable
ALTER TABLE `announcements` ADD COLUMN `type` ENUM('per_department', 'general') NOT NULL DEFAULT 'general';

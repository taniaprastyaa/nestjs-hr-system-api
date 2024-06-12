/*
  Warnings:

  - You are about to drop the column `type` on the `announcements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `announcements` DROP COLUMN `type`,
    ADD COLUMN `announcement_type` ENUM('per_department', 'general') NOT NULL DEFAULT 'general';

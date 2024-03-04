/*
  Warnings:

  - You are about to drop the column `announcement_types` on the `announcements` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `announcements` DROP FOREIGN KEY `announcements_department_id_fkey`;

-- AlterTable
ALTER TABLE `announcements` DROP COLUMN `announcement_types`,
    MODIFY `department_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `announcements` ADD CONSTRAINT `announcements_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `employee_id` on the `employee_tasks` table. All the data in the column will be lost.
  - Added the required column `priority` to the `employee_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee_tasks` DROP FOREIGN KEY `employee_tasks_employee_id_fkey`;

-- AlterTable
ALTER TABLE `employee_tasks` DROP COLUMN `employee_id`,
    ADD COLUMN `assigned_by` INTEGER NULL,
    ADD COLUMN `attachment` VARCHAR(191) NULL,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `priority` ENUM('High', 'Medium', 'Low') NOT NULL;

-- CreateTable
CREATE TABLE `employee_task_assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `employee_task_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee_tasks` ADD CONSTRAINT `employee_tasks_assigned_by_fkey` FOREIGN KEY (`assigned_by`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_task_assignments` ADD CONSTRAINT `employee_task_assignments_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_task_assignments` ADD CONSTRAINT `employee_task_assignments_employee_task_id_fkey` FOREIGN KEY (`employee_task_id`) REFERENCES `employee_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

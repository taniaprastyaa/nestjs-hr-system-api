/*
  Warnings:

  - You are about to alter the column `value` on the `leaves` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - A unique constraint covering the columns `[department_name]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position_name]` on the table `job_positions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leave_name]` on the table `leaves` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `leaves` MODIFY `value` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `departments_department_name_key` ON `departments`(`department_name`);

-- CreateIndex
CREATE UNIQUE INDEX `job_positions_position_name_key` ON `job_positions`(`position_name`);

-- CreateIndex
CREATE UNIQUE INDEX `leaves_leave_name_key` ON `leaves`(`leave_name`);

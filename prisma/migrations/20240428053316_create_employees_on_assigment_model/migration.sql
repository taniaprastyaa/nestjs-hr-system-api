/*
  Warnings:

  - You are about to drop the `employee_task_assignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee_task_assignments` DROP FOREIGN KEY `employee_task_assignments_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee_task_assignments` DROP FOREIGN KEY `employee_task_assignments_employee_task_id_fkey`;

-- DropTable
DROP TABLE `employee_task_assignments`;

-- CreateTable
CREATE TABLE `employees_on_assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `employee_task_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_on_assignment_temp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees_on_assignment` ADD CONSTRAINT `employees_on_assignment_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees_on_assignment` ADD CONSTRAINT `employees_on_assignment_employee_task_id_fkey` FOREIGN KEY (`employee_task_id`) REFERENCES `employee_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees_on_assignment_temp` ADD CONSTRAINT `employees_on_assignment_temp_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees_on_assignment_temp` ADD CONSTRAINT `employees_on_assignment_temp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

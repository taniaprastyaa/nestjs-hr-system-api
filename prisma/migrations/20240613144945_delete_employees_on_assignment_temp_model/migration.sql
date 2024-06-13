/*
  Warnings:

  - You are about to drop the `employees_on_assignment_temp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employees_on_assignment_temp` DROP FOREIGN KEY `employees_on_assignment_temp_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `employees_on_assignment_temp` DROP FOREIGN KEY `employees_on_assignment_temp_user_id_fkey`;

-- DropTable
DROP TABLE `employees_on_assignment_temp`;

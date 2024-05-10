/*
  Warnings:

  - You are about to drop the column `allowance` on the `salary_slips` table. All the data in the column will be lost.
  - You are about to drop the column `bonus` on the `salary_slips` table. All the data in the column will be lost.
  - You are about to alter the column `month` on the `salary_slips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `year` on the `salary_slips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `basic_salary` to the `salary_slips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `salary_slips` DROP COLUMN `allowance`,
    DROP COLUMN `bonus`,
    ADD COLUMN `basic_salary` INTEGER NOT NULL,
    MODIFY `month` INTEGER NOT NULL,
    MODIFY `year` INTEGER NOT NULL;

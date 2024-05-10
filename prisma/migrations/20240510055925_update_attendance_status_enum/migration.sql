-- AlterTable
ALTER TABLE `attendances` MODIFY `status` ENUM('Present', 'Absent', 'Leave', 'Half_day_leave') NOT NULL;

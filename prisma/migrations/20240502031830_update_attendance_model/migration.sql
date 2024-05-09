-- AlterTable
ALTER TABLE `attendances` MODIFY `time_in` VARCHAR(191) NULL,
    MODIFY `time_out` VARCHAR(191) NULL,
    MODIFY `status` ENUM('Present', 'Absent', 'Leave') NOT NULL;

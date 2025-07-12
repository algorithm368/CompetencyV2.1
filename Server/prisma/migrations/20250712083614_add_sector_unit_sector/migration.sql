-- CreateTable
CREATE TABLE `Occupational` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitOccupational` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitCodeId` INTEGER NOT NULL,
    `occupationalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitSector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitCodeId` INTEGER NOT NULL,
    `sectorId` INTEGER NOT NULL,

    INDEX `UnitSector_unitCodeId_idx`(`unitCodeId`),
    INDEX `UnitSector_sectorId_idx`(`sectorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UnitOccupational` ADD CONSTRAINT `UnitOccupational_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitOccupational` ADD CONSTRAINT `UnitOccupational_occupationalId_fkey` FOREIGN KEY (`occupationalId`) REFERENCES `Occupational`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitSector` ADD CONSTRAINT `UnitSector_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitSector` ADD CONSTRAINT `UnitSector_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `Sector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

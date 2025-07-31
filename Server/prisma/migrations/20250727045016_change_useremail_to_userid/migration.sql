/*
  Warnings:

  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AssetPermission` DROP FOREIGN KEY `AssetPermission_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `AssetPermission` DROP FOREIGN KEY `AssetPermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Token` DROP FOREIGN KEY `Token_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropTable
DROP TABLE `Asset`;

-- DropTable
DROP TABLE `AssetPermission`;

-- DropTable
DROP TABLE `Log`;

-- DropTable
DROP TABLE `Permission`;

-- DropTable
DROP TABLE `Profile`;

-- DropTable
DROP TABLE `RefreshToken`;

-- DropTable
DROP TABLE `Role`;

-- DropTable
DROP TABLE `RolePermission`;

-- DropTable
DROP TABLE `Token`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `UserRole`;

-- CreateTable
CREATE TABLE `Career` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `careerId` INTEGER NOT NULL,
    `levelId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Level` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerLevelDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detailsId` INTEGER NOT NULL,
    `description` VARCHAR(1200) NOT NULL,
    `careerLevelId` INTEGER NOT NULL,

    UNIQUE INDEX `CareerLevelDetail_detailsId_careerLevelId_key`(`detailsId`, `careerLevelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerLevelKnowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `careerLevelId` INTEGER NOT NULL,
    `knowledgeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerLevelSkill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `careerLevelId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerLevelUnitCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `careerLevelId` INTEGER NOT NULL,
    `unitCodeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Knowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserKnowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `knowledgeId` INTEGER NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `evidenceUrl` VARCHAR(1000) NULL,
    `approvalStatus` ENUM('APPROVED', 'NOT_APPROVED') NOT NULL DEFAULT 'NOT_APPROVED',

    INDEX `UserKnowledge_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSkill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skillId` INTEGER NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `evidenceUrl` VARCHAR(1000) NULL,
    `approvalStatus` ENUM('APPROVED', 'NOT_APPROVED') NOT NULL DEFAULT 'NOT_APPROVED',

    INDEX `UserSkill_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserUnitKnowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitCodeId` INTEGER NOT NULL,
    `knowledgeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserUnitSkill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitCodeId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `TpqiSummary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(255) NOT NULL,
    `careerId` INTEGER NOT NULL,
    `levelId` INTEGER NOT NULL,
    `careerLevelId` INTEGER NOT NULL,
    `skillPercent` DECIMAL(5, 2) NULL,
    `knowledgePercent` DECIMAL(5, 2) NULL,

    INDEX `TpqiSummary_userEmail_idx`(`userEmail`),
    UNIQUE INDEX `TpqiSummary_userEmail_careerLevelId_key`(`userEmail`, `careerLevelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CareerLevel` ADD CONSTRAINT `CareerLevel_careerId_fkey` FOREIGN KEY (`careerId`) REFERENCES `Career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevel` ADD CONSTRAINT `CareerLevel_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `Level`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelDetail` ADD CONSTRAINT `CareerLevelDetail_careerLevelId_fkey` FOREIGN KEY (`careerLevelId`) REFERENCES `CareerLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelKnowledge` ADD CONSTRAINT `CareerLevelKnowledge_careerLevelId_fkey` FOREIGN KEY (`careerLevelId`) REFERENCES `CareerLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelKnowledge` ADD CONSTRAINT `CareerLevelKnowledge_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelSkill` ADD CONSTRAINT `CareerLevelSkill_careerLevelId_fkey` FOREIGN KEY (`careerLevelId`) REFERENCES `CareerLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelSkill` ADD CONSTRAINT `CareerLevelSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelUnitCode` ADD CONSTRAINT `CareerLevelUnitCode_careerLevelId_fkey` FOREIGN KEY (`careerLevelId`) REFERENCES `CareerLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerLevelUnitCode` ADD CONSTRAINT `CareerLevelUnitCode_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserKnowledge` ADD CONSTRAINT `UserKnowledge_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkill` ADD CONSTRAINT `UserSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserUnitKnowledge` ADD CONSTRAINT `UserUnitKnowledge_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserUnitSkill` ADD CONSTRAINT `UserUnitSkill_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitOccupational` ADD CONSTRAINT `UnitOccupational_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitOccupational` ADD CONSTRAINT `UnitOccupational_occupationalId_fkey` FOREIGN KEY (`occupationalId`) REFERENCES `Occupational`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitSector` ADD CONSTRAINT `UnitSector_unitCodeId_fkey` FOREIGN KEY (`unitCodeId`) REFERENCES `UnitCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitSector` ADD CONSTRAINT `UnitSector_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `Sector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TpqiSummary` ADD CONSTRAINT `TpqiSummary_careerId_fkey` FOREIGN KEY (`careerId`) REFERENCES `Career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TpqiSummary` ADD CONSTRAINT `TpqiSummary_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `Level`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TpqiSummary` ADD CONSTRAINT `TpqiSummary_careerLevelId_fkey` FOREIGN KEY (`careerLevelId`) REFERENCES `CareerLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshTokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Profiles` DROP FOREIGN KEY `Profiles_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshTokens` DROP FOREIGN KEY `RefreshTokens_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermissions` DROP FOREIGN KEY `RolePermissions_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermissions` DROP FOREIGN KEY `RolePermissions_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `Tokens` DROP FOREIGN KEY `Tokens_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoles` DROP FOREIGN KEY `UserRoles_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoles` DROP FOREIGN KEY `UserRoles_user_id_fkey`;

-- DropTable
DROP TABLE `Logs`;

-- DropTable
DROP TABLE `Permissions`;

-- DropTable
DROP TABLE `Profiles`;

-- DropTable
DROP TABLE `RefreshTokens`;

-- DropTable
DROP TABLE `RolePermissions`;

-- DropTable
DROP TABLE `Roles`;

-- DropTable
DROP TABLE `Tokens`;

-- DropTable
DROP TABLE `UserRoles`;

-- DropTable
DROP TABLE `Users`;

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
    `description` VARCHAR(1200) NOT NULL,
    `careerLevelId` INTEGER NOT NULL,

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
    `userEmail` VARCHAR(255) NOT NULL,
    `evidenceUrl` VARCHAR(1000) NULL,
    `approvalStatus` ENUM('APPROVED', 'NOT_APPROVED') NOT NULL DEFAULT 'NOT_APPROVED',

    INDEX `UserKnowledge_userEmail_idx`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSkill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skillId` INTEGER NOT NULL,
    `userEmail` VARCHAR(255) NOT NULL,
    `evidenceUrl` VARCHAR(1000) NULL,
    `approvalStatus` ENUM('APPROVED', 'NOT_APPROVED') NOT NULL DEFAULT 'NOT_APPROVED',

    INDEX `UserSkill_userEmail_idx`(`userEmail`),
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
ALTER TABLE `TpqiSummary` ADD CONSTRAINT `TpqiSummary_careerId_fkey` FOREIGN KEY (`careerId`) REFERENCES `Career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TpqiSummary` ADD CONSTRAINT `TpqiSummary_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `Level`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TpqiSummary` ADD CONSTRAINT `TpqiSummary_careerLevelId_fkey` FOREIGN KEY (`careerLevelId`) REFERENCES `CareerLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

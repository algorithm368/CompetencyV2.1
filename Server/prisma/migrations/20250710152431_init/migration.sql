/*
  Warnings:

  - You are about to drop the column `skillCode` on the `Level` table. All the data in the column will be lost.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Description` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Information` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SfiaSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `Level` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Skill` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_subcategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Description` DROP FOREIGN KEY `Description_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `Information` DROP FOREIGN KEY `Information_dataCollectionId_fkey`;

-- DropForeignKey
ALTER TABLE `Information` DROP FOREIGN KEY `Information_subSkillId_fkey`;

-- DropForeignKey
ALTER TABLE `Level` DROP FOREIGN KEY `Level_skillCode_fkey`;

-- DropForeignKey
ALTER TABLE `SfiaSummary` DROP FOREIGN KEY `SfiaSummary_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `SfiaSummary` DROP FOREIGN KEY `SfiaSummary_skillCode_fkey`;

-- DropForeignKey
ALTER TABLE `Skill` DROP FOREIGN KEY `Skill_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `SubSkill` DROP FOREIGN KEY `SubSkill_descriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `SubSkill` DROP FOREIGN KEY `SubSkill_skillCode_fkey`;

-- AlterTable
ALTER TABLE `Level` DROP COLUMN `skillCode`,
    MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Skill` DROP PRIMARY KEY,
    DROP COLUMN `categoryId`,
    DROP COLUMN `code`,
    DROP COLUMN `levelId`,
    DROP COLUMN `note`,
    DROP COLUMN `overview`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `name` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `DataCollection`;

-- DropTable
DROP TABLE `Description`;

-- DropTable
DROP TABLE `Information`;

-- DropTable
DROP TABLE `SfiaSummary`;

-- DropTable
DROP TABLE `SubSkill`;

-- DropTable
DROP TABLE `Subcategory`;

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

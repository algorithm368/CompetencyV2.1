/*
  Warnings:

  - A unique constraint covering the columns `[detailsId,careerLevelId]` on the table `CareerLevelDetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `detailsId` to the `CareerLevelDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CareerLevelDetail` ADD COLUMN `detailsId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CareerLevelDetail_detailsId_careerLevelId_key` ON `CareerLevelDetail`(`detailsId`, `careerLevelId`);

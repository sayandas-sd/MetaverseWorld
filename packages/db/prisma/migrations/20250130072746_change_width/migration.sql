/*
  Warnings:

  - You are about to drop the column `Width` on the `Space` table. All the data in the column will be lost.
  - Added the required column `width` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Space" DROP COLUMN "Width",
ADD COLUMN     "width" TEXT NOT NULL;

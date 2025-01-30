/*
  Warnings:

  - Changed the type of `width` on the `Element` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `height` on the `Element` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `width` on the `Map` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `height` on the `Map` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `height` on the `Space` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `width` on the `Space` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "width",
ADD COLUMN     "width" INTEGER NOT NULL,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Map" DROP COLUMN "width",
ADD COLUMN     "width" INTEGER NOT NULL,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL,
DROP COLUMN "width",
ADD COLUMN     "width" INTEGER NOT NULL;

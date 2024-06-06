/*
  Warnings:

  - You are about to drop the column `itemNumber` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[location,partNumber]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location,itemName,partNumber]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_location_itemName_itemNumber_key";

-- DropIndex
DROP INDEX "Item_location_itemNumber_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "itemNumber",
ADD COLUMN     "partNumber" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Item_location_partNumber_key" ON "Item"("location", "partNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Item_location_itemName_partNumber_key" ON "Item"("location", "itemName", "partNumber");

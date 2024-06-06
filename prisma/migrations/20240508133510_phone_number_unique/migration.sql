/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Employee_location_name_phoneNumber_key";

-- DropIndex
DROP INDEX "Employee_location_phoneNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phoneNumber_key" ON "Employee"("phoneNumber");

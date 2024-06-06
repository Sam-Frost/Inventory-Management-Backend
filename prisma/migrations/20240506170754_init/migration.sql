-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "empId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("empId")
);

-- CreateTable
CREATE TABLE "Item" (
    "itemId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemName" TEXT NOT NULL,
    "itemNumber" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "AssignedItem" (
    "assignmentId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "AssignedItem_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "AssignedItemRecord" (
    "assignmentId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "AssignedItemRecord_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "Approval" (
    "approvalId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("approvalId")
);

-- CreateTable
CREATE TABLE "DefectiveItem" (
    "defectiveItemId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" INTEGER NOT NULL,
    "empId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "DefectiveItem_pkey" PRIMARY KEY ("defectiveItemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_name_key" ON "Employee"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phoneNumber_key" ON "Employee"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_location_name_key" ON "Employee"("location", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_location_phoneNumber_key" ON "Employee"("location", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_location_name_phoneNumber_key" ON "Employee"("location", "name", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Item_location_itemNumber_key" ON "Item"("location", "itemNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Item_location_itemName_key" ON "Item"("location", "itemName");

-- CreateIndex
CREATE UNIQUE INDEX "Item_location_itemName_itemNumber_key" ON "Item"("location", "itemName", "itemNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssignedItem_empId_itemId_key" ON "AssignedItem"("empId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_requestNumber_key" ON "Approval"("requestNumber");

-- AddForeignKey
ALTER TABLE "AssignedItem" ADD CONSTRAINT "AssignedItem_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("empId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedItem" ADD CONSTRAINT "AssignedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedItemRecord" ADD CONSTRAINT "AssignedItemRecord_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("empId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedItemRecord" ADD CONSTRAINT "AssignedItemRecord_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("empId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefectiveItem" ADD CONSTRAINT "DefectiveItem_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("empId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefectiveItem" ADD CONSTRAINT "DefectiveItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

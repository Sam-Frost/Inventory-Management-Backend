-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('GURGAON', 'FARIDABAD');

-- DropIndex
DROP INDEX "Approval_requestNumber_key";

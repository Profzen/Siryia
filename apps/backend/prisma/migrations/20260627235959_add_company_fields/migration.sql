-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isInformal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kybStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "CubeProfile" ADD COLUMN "nda_signed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "nda_signed_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "CubeProfile_nda_signed_idx" ON "CubeProfile"("nda_signed");

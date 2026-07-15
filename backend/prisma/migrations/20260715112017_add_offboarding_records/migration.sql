-- CreateTable
CREATE TABLE "OffboardingRecord" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "certificate_no" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mentor_name" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_text_tr" TEXT NOT NULL,
    "email_text_en" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffboardingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OffboardingRecord_cube_id_key" ON "OffboardingRecord"("cube_id");

-- CreateIndex
CREATE UNIQUE INDEX "OffboardingRecord_certificate_no_key" ON "OffboardingRecord"("certificate_no");

-- AddForeignKey
ALTER TABLE "OffboardingRecord" ADD CONSTRAINT "OffboardingRecord_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

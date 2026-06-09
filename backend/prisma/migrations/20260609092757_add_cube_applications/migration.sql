-- CreateTable
CREATE TABLE "CubeApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "year_of_study" TEXT NOT NULL,
    "why_join" TEXT NOT NULL,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CubeApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CubeApplication_email_key" ON "CubeApplication"("email");

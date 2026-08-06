-- DropForeignKey
ALTER TABLE "MissionTeam" DROP CONSTRAINT "MissionTeam_mission_id_fkey";

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "invited_cube_ids" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MissionTeam" ALTER COLUMN "mission_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MissionTeam" ADD CONSTRAINT "MissionTeam_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "CubeProfile" DROP COLUMN "status";

-- AlterEnum
BEGIN;
CREATE TYPE "CubeLevel_new" AS ENUM ('Cube', 'Senior_Cube', 'Former_Cube', 'Iceberger', 'Alumni');
ALTER TABLE "CubeProfile" ALTER COLUMN "current_level" DROP DEFAULT;
ALTER TABLE "CubeProfile" ALTER COLUMN "current_level" TYPE "CubeLevel_new" USING (
  CASE 
    WHEN "current_level"::text IN ('Cube', 'Senior_Cube', 'Former_Cube', 'Iceberger', 'Alumni') THEN "current_level"::text::"CubeLevel_new"
    ELSE 'Cube'::"CubeLevel_new"
  END
);
ALTER TABLE "CubeProfile" ALTER COLUMN "current_level" SET DEFAULT 'Cube';
DROP TYPE "CubeLevel";
ALTER TYPE "CubeLevel_new" RENAME TO "CubeLevel";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RecommendedNextStep_new" AS ENUM ('Continue_as_Cube', 'Consider_for_Senior_Cube', 'Consider_as_Former_Cube', 'Consider_as_Iceberger', 'Consider_as_Alumni', 'Needs_Support', 'Inactive_Risk');
ALTER TABLE "MentorFeedback" ALTER COLUMN "recommended_next_step" TYPE "RecommendedNextStep_new" USING (
  CASE
    WHEN "recommended_next_step"::text IN ('Continue_as_Cube', 'Consider_for_Senior_Cube', 'Consider_as_Former_Cube', 'Consider_as_Iceberger', 'Consider_as_Alumni', 'Needs_Support', 'Inactive_Risk') THEN "recommended_next_step"::text::"RecommendedNextStep_new"
    ELSE 'Continue_as_Cube'::"RecommendedNextStep_new"
  END
);
DROP TYPE "RecommendedNextStep";
ALTER TYPE "RecommendedNextStep_new" RENAME TO "RecommendedNextStep";
COMMIT;

-- DropEnum
DROP TYPE "CubeStatus";

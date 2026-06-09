-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MENTOR', 'CUBE');

-- CreateEnum
CREATE TYPE "CubeStatus" AS ENUM ('active', 'inactive', 'observer', 'project_contributor', 'part_time_candidate', 'part_time', 'full_time_candidate', 'alumni');

-- CreateEnum
CREATE TYPE "CubeLevel" AS ENUM ('Cube', 'Senior_Cube', 'Lead_Cube', 'Cube_Mentor', 'Iceberg_Fellow');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('idea_pool', 'selected', 'researching', 'building_demo', 'preparing_handover', 'demo_ready', 'reviewed', 'promoted_to_product_backlog', 'archived');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('Level_1_Research_Only', 'Level_2_Research_Mock', 'Level_3_Working_POC', 'Level_4_Integration_Candidate', 'Level_5_Main_Team_Assist');

-- CreateEnum
CREATE TYPE "MissionDecision" AS ENUM ('Promote_to_Product_Backlog', 'Needs_More_Research', 'Keep_as_Internal_Tool', 'Archive', 'Moved_to_Product');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('Mission_Lead', 'Technical_Explorer', 'Demo_Builder', 'Documenter', 'Presenter', 'Contributor');

-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('daily', 'weekly', 'mission_progress');

-- CreateEnum
CREATE TYPE "RecommendedNextStep" AS ENUM ('Continue_as_Cube', 'Consider_for_Senior_Cube', 'Consider_for_Lead_Cube', 'Consider_as_Observer', 'Consider_as_Project_Contributor', 'Consider_as_Part_Time_Candidate', 'Needs_Support', 'Inactive_Risk');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUBE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CubeProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cube_number" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "github_url" TEXT,
    "gitlab_url" TEXT,
    "linkedin_url" TEXT,
    "slack_handle" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],
    "current_level" "CubeLevel" NOT NULL DEFAULT 'Cube',
    "status" "CubeStatus" NOT NULL DEFAULT 'active',
    "assigned_mentor_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CubeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "problem_statement" TEXT NOT NULL,
    "expected_output" TEXT NOT NULL,
    "difficulty_level" "DifficultyLevel" NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'idea_pool',
    "created_by_id" TEXT NOT NULL,
    "mentor_id" TEXT,
    "slack_channel_url" TEXT,
    "repository_url" TEXT,
    "demo_url" TEXT,
    "decision" "MissionDecision",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionTeam" (
    "id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionTeamMember" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "role" "TeamMemberRole" NOT NULL DEFAULT 'Contributor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "type" "UpdateType" NOT NULL,
    "content" TEXT NOT NULL,
    "blockers" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoSubmission" (
    "id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "team_id" TEXT,
    "submitted_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "what_we_built" TEXT NOT NULL,
    "what_we_learned" TEXT NOT NULL,
    "what_worked_well" TEXT NOT NULL,
    "what_could_we_have_done_better" TEXT NOT NULL,
    "recommendation" TEXT,
    "repository_url" TEXT,
    "pull_request_url" TEXT,
    "demo_url" TEXT,
    "document_url" TEXT,
    "video_url" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorFeedback" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "technical_ability_score" INTEGER NOT NULL,
    "research_ability_score" INTEGER NOT NULL,
    "demo_output_score" INTEGER NOT NULL,
    "ownership_score" INTEGER NOT NULL,
    "communication_score" INTEGER NOT NULL,
    "leadership_score" INTEGER NOT NULL,
    "product_thinking_score" INTEGER NOT NULL,
    "reliability_score" INTEGER NOT NULL,
    "self_reflection_score" INTEGER NOT NULL,
    "strengths" TEXT NOT NULL,
    "areas_to_improve" TEXT NOT NULL,
    "private_notes" TEXT,
    "visible_to_cube" BOOLEAN NOT NULL DEFAULT false,
    "recommended_next_step" "RecommendedNextStep" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CubeBadge" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "mission_id" TEXT,
    "awarded_by_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "awarded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CubeBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoDay" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoDayPresentation" (
    "id" TEXT NOT NULL,
    "demo_day_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "team_id" TEXT,
    "presenter_id" TEXT NOT NULL,
    "demo_submission_id" TEXT,
    "decision" TEXT,
    "mentor_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoDayPresentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CubeProfile_user_id_key" ON "CubeProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CubeProfile_cube_number_key" ON "CubeProfile"("cube_number");

-- CreateIndex
CREATE UNIQUE INDEX "MissionTeamMember_team_id_cube_id_key" ON "MissionTeamMember"("team_id", "cube_id");

-- CreateIndex
CREATE UNIQUE INDEX "MentorFeedback_cube_id_mission_id_mentor_id_key" ON "MentorFeedback"("cube_id", "mission_id", "mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");

-- AddForeignKey
ALTER TABLE "CubeProfile" ADD CONSTRAINT "CubeProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeProfile" ADD CONSTRAINT "CubeProfile_assigned_mentor_id_fkey" FOREIGN KEY ("assigned_mentor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionTeam" ADD CONSTRAINT "MissionTeam_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionTeamMember" ADD CONSTRAINT "MissionTeamMember_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "MissionTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionTeamMember" ADD CONSTRAINT "MissionTeamMember_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSubmission" ADD CONSTRAINT "DemoSubmission_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSubmission" ADD CONSTRAINT "DemoSubmission_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "MissionTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSubmission" ADD CONSTRAINT "DemoSubmission_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeBadge" ADD CONSTRAINT "CubeBadge_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeBadge" ADD CONSTRAINT "CubeBadge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeBadge" ADD CONSTRAINT "CubeBadge_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubeBadge" ADD CONSTRAINT "CubeBadge_awarded_by_id_fkey" FOREIGN KEY ("awarded_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoDayPresentation" ADD CONSTRAINT "DemoDayPresentation_demo_day_id_fkey" FOREIGN KEY ("demo_day_id") REFERENCES "DemoDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoDayPresentation" ADD CONSTRAINT "DemoDayPresentation_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoDayPresentation" ADD CONSTRAINT "DemoDayPresentation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "MissionTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoDayPresentation" ADD CONSTRAINT "DemoDayPresentation_presenter_id_fkey" FOREIGN KEY ("presenter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoDayPresentation" ADD CONSTRAINT "DemoDayPresentation_demo_submission_id_fkey" FOREIGN KEY ("demo_submission_id") REFERENCES "DemoSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Performance indexes.
--
-- ADDITIVE ONLY. This migration contains nothing but CREATE INDEX statements:
-- no ALTER TABLE, no DROP, no UPDATE, no ADD COLUMN. No existing row is read,
-- rewritten or deleted, and no table structure changes.
--
-- Postgres does not create indexes for foreign keys automatically, so every
-- lookup by cube_id / mission_id / user_id / status was a sequential scan.
--
-- IF NOT EXISTS is used so the migration is safe to re-run and tolerates an
-- index that was already created by hand on the target database.

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CubeBadge_cube_id_idx" ON "CubeBadge"("cube_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CubeBadge_badge_id_idx" ON "CubeBadge"("badge_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CubeBadge_mission_id_idx" ON "CubeBadge"("mission_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CubeBadge_awarded_at_idx" ON "CubeBadge"("awarded_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CubeProfile_assigned_mentor_id_idx" ON "CubeProfile"("assigned_mentor_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CubeProfile_current_level_idx" ON "CubeProfile"("current_level");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DemoDayPresentation_demo_day_id_idx" ON "DemoDayPresentation"("demo_day_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DemoDayPresentation_mission_id_idx" ON "DemoDayPresentation"("mission_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DemoDayPresentation_presenter_id_idx" ON "DemoDayPresentation"("presenter_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DemoSubmission_mission_id_idx" ON "DemoSubmission"("mission_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DemoSubmission_submitted_by_id_idx" ON "DemoSubmission"("submitted_by_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DemoSubmission_team_id_idx" ON "DemoSubmission"("team_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MeetingAttendance_cube_id_idx" ON "MeetingAttendance"("cube_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MentorFeedback_mentor_id_idx" ON "MentorFeedback"("mentor_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MentorFeedback_mission_id_idx" ON "MentorFeedback"("mission_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MentorFeedback_recommended_next_step_idx" ON "MentorFeedback"("recommended_next_step");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Mission_status_idx" ON "Mission"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Mission_mentor_id_idx" ON "Mission"("mentor_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Mission_updated_at_idx" ON "Mission"("updated_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MissionTeam_mission_id_idx" ON "MissionTeam"("mission_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MissionTeamMember_cube_id_idx" ON "MissionTeamMember"("cube_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Notification_user_id_created_at_idx" ON "Notification"("user_id", "created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PrivateNote_cube_id_created_at_idx" ON "PrivateNote"("cube_id", "created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PrivateNote_created_by_id_idx" ON "PrivateNote"("created_by_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Testimonial_cube_id_idx" ON "Testimonial"("cube_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Testimonial_is_approved_created_at_idx" ON "Testimonial"("is_approved", "created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Update_mission_id_created_at_idx" ON "Update"("mission_id", "created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Update_cube_id_idx" ON "Update"("cube_id");

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "cube_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "wrong_count" INTEGER NOT NULL DEFAULT 0,
    "hint_penalty" INTEGER NOT NULL DEFAULT 0,
    "duration_seconds" INTEGER,
    "questions" JSONB NOT NULL,
    "answer_key" JSONB NOT NULL,
    "user_answers" JSONB,
    "hints_used" JSONB,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "badge_awarded_id" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizAttempt_cube_id_idx" ON "QuizAttempt"("cube_id");

-- CreateIndex
CREATE INDEX "QuizAttempt_status_idx" ON "QuizAttempt"("status");

-- CreateIndex
CREATE INDEX "QuizAttempt_completed_at_idx" ON "QuizAttempt"("completed_at");

-- CreateIndex
CREATE INDEX "QuizAttempt_score_idx" ON "QuizAttempt"("score");

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_cube_id_fkey" FOREIGN KEY ("cube_id") REFERENCES "CubeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_badge_awarded_id_fkey" FOREIGN KEY ("badge_awarded_id") REFERENCES "Badge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

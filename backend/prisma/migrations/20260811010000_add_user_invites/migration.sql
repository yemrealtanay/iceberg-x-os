-- One-time invitation links, replacing the shared DEFAULT_CUBE_PASSWORD.
--
-- ADDITIVE ONLY. This migration creates a single new table and its own
-- constraints. It does NOT touch "User", "CubeProfile" or any other existing
-- table: every account already created with DEFAULT_CUBE_PASSWORD keeps its
-- password_hash untouched and continues to sign in exactly as before.
--
-- The two ALTER TABLE statements below add foreign keys to the NEW table.

-- CreateTable
CREATE TABLE "UserInvite" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInvite_token_hash_key" ON "UserInvite"("token_hash");

-- CreateIndex
CREATE INDEX "UserInvite_user_id_idx" ON "UserInvite"("user_id");

-- CreateIndex
CREATE INDEX "UserInvite_expires_at_idx" ON "UserInvite"("expires_at");

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


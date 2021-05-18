CREATE TABLE "claim_url" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "claim_url" TEXT NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "github_id" TEXT,
    "find_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

CREATE INDEX "claim_url.github_id_index" ON "claim_url"("github_id");

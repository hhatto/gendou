-- CreateTable
CREATE TABLE "reward" (
    "id" SERIAL NOT NULL,
    "commit_lower_limit" INTEGER NOT NULL,
    "commit_upper_limit" INTEGER NOT NULL,
    "reward" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_url" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "claim_url" TEXT NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "github_id" TEXT,
    "find_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "already_claimed" (
    "id" SERIAL NOT NULL,
    "github_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry" (
    "id" SERIAL NOT NULL,
    "github_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "sign" TEXT NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "contribution_count" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "update_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reward.commit_lower_limit_unique" ON "reward"("commit_lower_limit");

-- CreateIndex
CREATE UNIQUE INDEX "reward.commit_upper_limit_unique" ON "reward"("commit_upper_limit");

-- CreateIndex
CREATE UNIQUE INDEX "reward.rank_unique" ON "reward"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "entry.github_id_unique" ON "entry"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "entry.address_unique" ON "entry"("address");

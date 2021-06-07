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
CREATE UNIQUE INDEX "entry.github_id_unique" ON "entry"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "entry.address_unique" ON "entry"("address");

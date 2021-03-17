-- CreateTable
CREATE TABLE "send_info" (
    "id" SERIAL NOT NULL,
    "github_id" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "is_already_send" BOOLEAN NOT NULL DEFAULT false,
    "tx_hash" TEXT,
    "send_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "send_info.github_id_unique" ON "send_info"("github_id");

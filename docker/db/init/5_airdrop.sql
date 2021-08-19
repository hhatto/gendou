-- CreateTable
CREATE TABLE "airdrop" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airdrop.address_unique" ON "airdrop"("address");

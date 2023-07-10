-- CreateTable
CREATE TABLE "Dog" (
    "ID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dog_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dog_name_key" ON "Dog"("name");

-- CreateIndex
CREATE INDEX "Dog_ID_name_createdAt_idx" ON "Dog"("ID", "name", "createdAt");

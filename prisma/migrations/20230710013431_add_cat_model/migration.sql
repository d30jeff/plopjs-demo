-- CreateTable
CREATE TABLE "Cat" (
    "ID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cat_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cat_name_key" ON "Cat"("name");

-- CreateIndex
CREATE INDEX "Cat_ID_name_createdAt_idx" ON "Cat"("ID", "name", "createdAt");

-- CreateTable
CREATE TABLE "synsets" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "parent_path" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "synsets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "synsets_path_key" ON "synsets"("path");

-- CreateIndex
CREATE INDEX "idx_parent_path" ON "synsets"("parent_path");

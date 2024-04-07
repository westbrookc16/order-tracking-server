/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "client_name_key" ON "client"("name");

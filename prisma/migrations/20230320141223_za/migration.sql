/*
  Warnings:

  - The primary key for the `chatroom` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "chatroom" DROP CONSTRAINT "chatroom_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "chatroom_pkey" PRIMARY KEY ("id");

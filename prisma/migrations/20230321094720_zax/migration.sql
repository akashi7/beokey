/*
  Warnings:

  - Added the required column `firstUser` to the `chatroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondUser` to the `chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatroom_fkey";

-- AlterTable
ALTER TABLE "chatroom" ADD COLUMN     "firstUser" INTEGER NOT NULL,
ADD COLUMN     "secondUser" INTEGER NOT NULL;

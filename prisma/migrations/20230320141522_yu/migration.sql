-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "chatroom" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatroom_fkey" FOREIGN KEY ("chatroom") REFERENCES "chatroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

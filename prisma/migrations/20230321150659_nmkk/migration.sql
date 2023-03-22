-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "messages_id_seq";

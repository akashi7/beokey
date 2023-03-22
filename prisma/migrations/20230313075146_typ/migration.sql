-- CreateTable
CREATE TABLE "doctorAvailabity" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "dates" TEXT[],

    CONSTRAINT "doctorAvailabity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctorAvailabity" ADD CONSTRAINT "doctorAvailabity_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

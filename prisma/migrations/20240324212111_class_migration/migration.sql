-- AlterTable
ALTER TABLE "students" ADD COLUMN     "classId" TEXT;

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

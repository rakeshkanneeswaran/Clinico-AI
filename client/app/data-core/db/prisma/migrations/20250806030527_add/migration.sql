-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Not Provided',
    "age" TEXT NOT NULL DEFAULT 'Not Provided',
    "gender" TEXT NOT NULL DEFAULT 'Not Provided',
    "weight" TEXT NOT NULL DEFAULT 'Not Provided',
    "height" TEXT NOT NULL DEFAULT 'Not Provided',
    "bloodType" TEXT NOT NULL DEFAULT 'Not Provided',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_sessionId_key" ON "public"."Patient"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

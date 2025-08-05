-- CreateTable
CREATE TABLE "public"."Transcript" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Transcript" ADD CONSTRAINT "Transcript_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

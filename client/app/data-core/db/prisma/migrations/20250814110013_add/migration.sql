-- CreateTable
CREATE TABLE "public"."CustomDocument" (
    "id" TEXT NOT NULL,
    "UserId" TEXT,
    "DocumentName" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fields" (
    "id" TEXT NOT NULL,
    "FieldName" TEXT NOT NULL,
    "FieldDescription" TEXT NOT NULL,
    "customDocumentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CustomDocument" ADD CONSTRAINT "CustomDocument_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fields" ADD CONSTRAINT "Fields_customDocumentId_fkey" FOREIGN KEY ("customDocumentId") REFERENCES "public"."CustomDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

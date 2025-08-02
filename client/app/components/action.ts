"use server";
import { S3Service } from "../data-core/services/s3-service";

export async function uploadedFileToS3(file: File): Promise<void> {
    if (!file) {
        throw new Error("No file selected");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await S3Service.uploadFile(buffer);
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No file selected"));
            return;
        }

        file.arrayBuffer().then((arrayBuffer) => {
            const buffer = Buffer.from(arrayBuffer);
            S3Service.uploadFile(buffer)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    });
}
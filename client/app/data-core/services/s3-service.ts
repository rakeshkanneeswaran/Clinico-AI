import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


export class S3Service {



    private static s3Client = new S3Client({
        region: "us-east-1", // Replace with your region
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    });

    static generateRandomS3BucketName(prefix = "clinic-scribe") {
        const timestamp = Date.now().toString(36); // base-36 timestamp
        const randomStr = Math.random().toString(36).substring(2, 8); // random 6 chars
        return `${prefix}-${timestamp}-${randomStr}`.toLowerCase();
    }


    static async uploadFile(body: Buffer | string): Promise<void> {
        const key = this.generateRandomS3BucketName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: "audio/wav"
        });

        try {
            await this.s3Client.send(command);
            console.log(`File uploaded successfully to ${process.env.AWS_S3_BUCKET_NAME}/${key}`);
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }
}
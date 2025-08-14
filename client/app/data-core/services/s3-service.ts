import { S3Client, PutObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export class S3Service {

    private static s3Client = new S3Client({
        region: "us-east-1",
    });

    static generateRandomS3BucketName(prefix = "clinic-scribe") {
        const timestamp = Date.now().toString(36); // base-36 timestamp
        const randomStr = Math.random().toString(36).substring(2, 8); // random 6 chars
        return `${prefix}-${timestamp}-${randomStr}`.toLowerCase();
    }


    static async uploadFile(body: Buffer | string): Promise<string> {
        const key = this.generateRandomS3BucketName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: "audio/wav"
        });

        try {
            console.log(`Uploading file to S3: ${process.env.AWS_S3_BUCKET_NAME}/${key}`);
            await this.s3Client.send(command);
            console.log(`File uploaded successfully to ${process.env.AWS_S3_BUCKET_NAME}/${key}`);
            return key;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    static async generateUploadUrl(fileType: string) {
        const key = this.generateRandomS3BucketName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            ContentType: fileType,
        });

        // Expires in 60 seconds
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });
        return url;
    }
}
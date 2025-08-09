import boto3
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


s3Client = boto3.client(
    "s3",
    region_name="us-west-2",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
)


def save_wav_from_s3(s3_key):
    local_folder = os.getcwd()
    # Create local folder if it doesn't exist
    os.makedirs(local_folder, exist_ok=True)

    bucket_name = os.environ.get("S3_BUCKET_NAME", "clinic-scribe-bucket")

    # Initialize S3 client
    s3 = s3Client

    # Generate local file path
    file_name = os.path.basename(s3_key)
    local_path = os.path.join(local_folder, file_name)
    finally_path = os.path.abspath(local_path + ".wav")

    # Download file from S3
    s3.download_file(bucket_name, s3_key, finally_path)

    return finally_path

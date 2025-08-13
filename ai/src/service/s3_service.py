import boto3
import os
from boto3.s3.transfer import TransferConfig
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Configure S3 client with optimized settings
s3_client = boto3.client(
    "s3",
    region_name="us-west-2",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    config=boto3.session.Config(
        connect_timeout=30,  # seconds
        read_timeout=30,  # seconds
        retries={"max_attempts": 3},
    ),
)


def save_wav_from_s3(s3_key):
    """Download file from S3 with optimized multipart configuration"""
    start_time = time.time()

    bucket_name = os.environ.get("S3_BUCKET_NAME", "clinic-scribe-bucket")
    file_name = os.path.basename(s3_key)
    local_path = os.path.abspath(os.path.join(os.getcwd(), f"{file_name}.wav"))

    # Custom transfer configuration
    transfer_config = TransferConfig(
        multipart_threshold=8 * 1024 * 1024,  # 8MB (minimum part size)
        max_concurrency=15,  # Increased from default 10
        num_download_attempts=3,  # Retry individual parts
        use_threads=True,
    )

    print(f"[INFO] Starting optimized download of {s3_key}")
    s3_client.download_file(
        Bucket=bucket_name, Key=s3_key, Filename=local_path, Config=transfer_config
    )

    # Calculate performance metrics
    file_size = os.path.getsize(local_path) / (1024 * 1024)  # in MB
    duration = time.time() - start_time
    speed = file_size / duration if duration > 0 else 0

    print(
        f"[SUCCESS] Downloaded {file_size:.2f}MB in {duration:.2f}s ({speed:.2f}MB/s)"
    )
    return local_path

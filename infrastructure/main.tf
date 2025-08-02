provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "clinic_scribe_bucket" {
  bucket = "clinic-scribe-bucket"
}

resource "aws_s3_bucket_public_access_block" "clinic_scribe_bucket" {
  bucket = aws_s3_bucket.clinic_scribe_bucket.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "clinic_scribe_cors" {
  bucket = aws_s3_bucket.clinic_scribe_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
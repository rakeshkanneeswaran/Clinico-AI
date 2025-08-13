from service.s3_service import save_wav_from_s3
from core.transcription import fast_transcribe


def delete_wav_file(file_path):
    """Delete the WAV file from the local filesystem."""
    import os

    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted local file: {file_path}")
    else:
        print(f"File not found: {file_path}")


def transcribeS3Audio(file_path):
    finally_path = save_wav_from_s3(file_path)
    transcript, time_taken = fast_transcribe(finally_path)
    delete_wav_file(finally_path)  # Clean up the local file after transcription
    return transcript

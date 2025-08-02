from service.s3_service import save_wav_from_s3
from core.transcription import fast_transcribe


def transcribeS3Audio(file_path):
    finally_path = save_wav_from_s3(file_path)
    transcript, time_taken = fast_transcribe(finally_path, model_size="base")
    print(f"Transcription time: {time_taken:.1f}s\n")
    print(transcript)
    return transcript

import whisper
import time


device = "cpu"
model = whisper.load_model("tiny.en").to(device)


def fast_transcribe(audio_file):
    """Direct Whisper transcription without diarization"""
    # Load model (smaller = faster but less accurate)

    # Time the transcription
    start_time = time.time()
    result = model.transcribe(
        audio_file,
        fp16=False,  # Disable FP16 (not needed/supported on MPS)
        temperature=0.0,  # Faster decoding
        language="en",  # Optional: specify if you know the language
        without_timestamps=True,  # Slightly faster
    )
    elapsed = time.time() - start_time

    transcript = []
    for segment in result["segments"]:
        text = segment["text"].strip()
        transcript.append(f"{text}")

    return "\n".join(transcript), elapsed

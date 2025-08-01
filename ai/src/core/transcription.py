import whisper
import time


def fast_transcribe(audio_file, model_size="tiny"):
    """Direct Whisper transcription without diarization"""

    # Load model (smaller = faster but less accurate)
    model = whisper.load_model(model_size)

    # Time the transcription
    start_time = time.time()
    result = model.transcribe(audio_file)
    elapsed = time.time() - start_time

    # Return unified transcript with timing info
    transcript = []
    for segment in result["segments"]:
        start = segment["start"]
        end = segment["end"]
        text = segment["text"].strip()
        transcript.append(f"{start:.1f}s - {end:.1f}s: {text}")

    return "\n".join(transcript), elapsed


# Usage
audio_file = "test.wav"
transcript, time_taken = fast_transcribe(
    audio_file, model_size="base"
)  # Try "small" for speed
print(f"Transcription time: {time_taken:.1f}s\n")
print(transcript)

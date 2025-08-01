from pyannote.audio import Pipeline
import whisper
import os

# Initialize pipelines

token = os.environ.get("HF_TOKEN")
diarization_pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization@2.1",
    use_auth_token=token,
)
asr_pipeline = whisper.load_model("base")


def process_audio_to_transcript(audio_file):
    diarization = diarization_pipeline(audio_file)
    full_transcript = []

    for turn, _, speaker in diarization.itertracks(yield_label=True):
        start, end = turn.start, turn.end
        segment = whisper.load_audio(audio_file)[int(start * 16000) : int(end * 16000)]
        text = asr_pipeline.transcribe(segment, language="en")["text"].strip()

        # Format each speaker segment
        speaker_label = (
            f"Speaker {speaker.split('_')[-1]}"  # Convert "SPEAKER_00" to "Speaker 00"
        )
        full_transcript.append(f"{start:.1f}s - {end:.1f}s | {speaker_label}: {text}")

    # Return as a single string (one line per segment)
    return "\n".join(full_transcript)


# Usage
audio_file = "test.wav"
transcript = process_audio_to_transcript(audio_file)
print(transcript)  # Pass this to your LLM

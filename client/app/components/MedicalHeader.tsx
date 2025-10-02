"use client";

import {
  useState,
  useRef,
  useEffect,
  Suspense,
  Dispatch,
  SetStateAction,
  use,
} from "react";
import Recorder from "recorder-js";
import { Button } from "@/components/ui/button";
import {
  X,
  Mic,
  MicOff,
  MoreVertical,
  Upload as UploadIcon,
  Download,
  User,
} from "lucide-react";
import { PatientForm } from "./PatientForm";
import { useSearchParams } from "next/navigation";
import { getTranscriptBySession } from "./action";

interface MedicalHeaderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  recordingTime?: string;
  onClose: () => void;
  setTranscription: Dispatch<SetStateAction<string>>;
}

export function MedicalHeader({
  isRecording,
  onToggleRecording,
  recordingTime = "00:45",
  onClose,
  setTranscription,
}: MedicalHeaderProps) {
  const colors = {
    primary: "#3b82f6",
    accent: "#10b981",
    danger: "#ef4444",
    recordingBg: "#fef2f2",
  };

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const recorderRef = useRef<Recorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const session = searchParams.get("session");

  useEffect(() => {
    if (session) {
      (async () => {
        const transcript = await getTranscriptBySession({ sessionId: session });
        if (transcript) {
          setTranscription(transcript);
        }
      })();
    }
  }, [session, setTranscription]);

  const ASSEMBLYAI_API_KEY = "ab7aee9937fc413985897d7d96b8c3f1"; // ⚠️ keep secure (move to backend later)

  /** ----------------- AssemblyAI Integration ----------------- **/

  const uploadToAssemblyAI = async (audioBlob: Blob): Promise<string> => {
    const response = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: { authorization: ASSEMBLYAI_API_KEY },
      body: audioBlob,
    });

    const data = await response.json();
    if (!data.upload_url)
      throw new Error("Failed to upload audio to AssemblyAI");
    return data.upload_url;
  };

  const createTranscription = async (uploadUrl: string): Promise<string> => {
    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
        speech_model: "universal",
      }),
    });

    const data = await response.json();
    if (!data.id) throw new Error("Failed to create transcription job");
    return data.id;
  };

  const pollTranscription = async (transcriptId: string): Promise<string> => {
    const pollingUrl = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    while (true) {
      const res = await fetch(pollingUrl, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });
      const data = await res.json();

      if (data.status === "completed") return data.text;
      if (data.status === "error") throw new Error(data.error);
      await new Promise((r) => setTimeout(r, 3000));
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(25);

    try {
      // 1️⃣ Upload directly to AssemblyAI
      const uploadUrl = await uploadToAssemblyAI(audioBlob);
      setUploadProgress(50);

      // 2️⃣ Create transcription
      const transcriptId = await createTranscription(uploadUrl);
      setUploadProgress(75);

      // 3️⃣ Poll until ready
      const text = await pollTranscription(transcriptId);
      setTranscription(text);

      setUploadProgress(100);
      setSuccessMessage("Transcription complete!");
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      console.error("Transcription failed:", err);
      setErrorMessage(err.message || "Error transcribing audio.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  /** ----------------- Recording Logic ----------------- **/

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors.primary;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyserRef.current = analyser;

    drawWaveform();

    const recorder = new Recorder(audioContext, {});
    await recorder.init(stream);
    recorder.start();
    recorderRef.current = recorder;
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    const { blob } = await recorderRef.current.stop();
    const url = URL.createObjectURL(blob);
    setAudioURL(url);

    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);

    // ✅ Directly send to AssemblyAI
    await handleTranscription(blob);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
    onToggleRecording();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleTranscription(file);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        {showPatientForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Patient Details</h3>
                <button
                  onClick={() => setShowPatientForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <PatientForm />
              </div>
            </div>
          </div>
        )}

        <div
          className="border-b p-6 backdrop-blur-sm relative z-10"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
            borderColor: `${colors.primary}20`,
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowPatientForm(true)}
              >
                <User className="h-4 w-4" />
                Patient Details
              </Button>
              <span className="text-sm text-gray-500">
                &larr; Click to view and edit patient details
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".wav,audio/wav"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isRecording || isUploading}
                />
                <Button
                  asChild
                  variant="outline"
                  className="gap-2"
                  disabled={isRecording || isUploading}
                >
                  <label htmlFor="file-upload">
                    <UploadIcon className="h-4 w-4" />
                    Upload
                  </label>
                </Button>
              </div>

              {isUploading && (
                <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden relative animate-pulse">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {audioURL && (
                <a
                  href={audioURL}
                  download="recording.wav"
                  className="ml-2 text-sm text-blue-600 flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              )}

              {isRecording && (
                <canvas
                  ref={canvasRef}
                  width={150}
                  height={40}
                  className="bg-gray-100 rounded"
                />
              )}

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isRecording ? "border" : "bg-muted"
                }`}
                style={{
                  backgroundColor: isRecording ? colors.recordingBg : undefined,
                  color: isRecording ? colors.danger : undefined,
                  borderColor: isRecording ? `${colors.danger}20` : undefined,
                }}
              >
                {isRecording ? (
                  <>
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: colors.danger }}
                    />
                    <span className="font-mono text-sm">{recordingTime}</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span className="text-sm">Ready to record</span>
                  </>
                )}
              </div>

              <Button
                onClick={toggleRecording}
                size="icon"
                className="rounded-full"
                style={{
                  backgroundColor: isRecording ? colors.danger : colors.primary,
                  color: "white",
                }}
                disabled={isUploading}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                style={{ color: colors.primary }}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600 mt-2">{successMessage}</p>
          )}
        </div>
      </>
    </Suspense>
  );
}

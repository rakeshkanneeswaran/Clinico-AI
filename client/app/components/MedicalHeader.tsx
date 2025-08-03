"use client";

import { useState, useRef } from "react";
import Recorder from "recorder-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { uploadedFileToS3 } from "./action";
import { generateTranscription } from "./action";
import { Dispatch, SetStateAction } from "react";
import {
  Mic,
  MicOff,
  MoreVertical,
  Clock,
  Globe,
  Upload as UploadIcon,
  Download,
} from "lucide-react";

interface MedicalHeaderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  recordingTime?: string;
  maxSizeInMB?: number;
  onClose: () => void;
  setTranscription: Dispatch<SetStateAction<string>>;
}

interface UploadedFile {
  file: File;
  duration?: number;
  size: number;
  name: string;
}

export function MedicalHeader({
  isRecording,
  onToggleRecording,
  recordingTime = "00:45",
  maxSizeInMB = 100,
  onClose,
  setTranscription,
}: MedicalHeaderProps) {
  const colors = {
    primary: "#3b82f6",
    secondary: "#000000",
    accent: "#10b981",
    danger: "#ef4444",
    badge: "#6366f1",
    recordingBg: "#fef2f2",
  };

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const recorderRef = useRef<Recorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    if (
      !file.type.includes("audio/wav") &&
      !file.name.toLowerCase().endsWith(".wav")
    ) {
      setErrorMessage("Please upload a WAV audio file.");
      return false;
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      setErrorMessage(`File size must be less than ${maxSizeInMB}MB.`);
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener("loadedmetadata", () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });

      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        resolve(0);
      });

      audio.src = url;
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const duration = await getAudioDuration(file);
      const fileKey = await uploadedFileToS3(file);
      const transcriptionResponse = await generateTranscription(fileKey);
      console.log("Transcription Response:", transcriptionResponse);
      setTranscription(transcriptionResponse.transcript);

      setSuccessMessage(
        `${file.name} uploaded successfully (${Math.round(duration)}s)!`
      );
      setUploadProgress(100);

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Error uploading file.");
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

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
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    onToggleRecording();
  };

  return (
    <div
      className="border-b p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
        borderColor: `${colors.primary}20`,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2
            className="text-2xl font-bold"
            style={{ color: colors.secondary }}
          >
            Patient Documentation
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <Badge
              variant="outline"
              className="gap-1.5"
              style={{ color: colors.badge, borderColor: `${colors.badge}20` }}
            >
              <Globe className="h-3 w-3" />
              English
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5"
              style={{ color: colors.badge, borderColor: `${colors.badge}20` }}
            >
              <Clock className="h-3 w-3" />
              14 days retention
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Upload Button */}
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

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden relative animate-pulse">
              <div
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Download Recorded Audio */}
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

          {/* Recording Status */}
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

          {/* Record Button */}
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

          {/* Options Button */}
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

      {/* Feedback */}
      {errorMessage && (
        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600 mt-2">{successMessage}</p>
      )}
    </div>
  );
}

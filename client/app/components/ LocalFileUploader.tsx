import React, { useState } from "react";
import { uploadedFileToS3 } from "./action";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LocalFileUploader: React.FC<Props> = ({ visible, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "audio/wav") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid .wav file.");
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    // You can integrate S3 upload logic here
    if (!selectedFile) return;
    uploadedFileToS3(selectedFile)
      .then(() => {
        alert("File uploaded successfully!");
        onClose();
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Upload a .wav file</h2>
        <input
          type="file"
          accept=".wav"
          onChange={handleFileChange}
          className="block w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalFileUploader;

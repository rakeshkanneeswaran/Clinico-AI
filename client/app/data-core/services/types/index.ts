// types/index.ts

// 🎤 Response after transcription
export interface GenerateTranscriptionResponse {
    s3_file_name: string;
    transcript: string;
    message: string;
}

// 📄 Field definition inside a template or document
export interface DocumentField {
    name: string;       // Internal key (e.g. "diagnosis")
    label: string;      // Short display name (e.g. "Dx")
    description: string; // Extra context (e.g. "Primary diagnosis code")
}

// 📝 Template definition
export interface Template {
    name: string;
    description: string;
    fields: DocumentField[];
}

// 📑 Request payload for document generation
export interface GenerateDocumentRequest {
    transcript: string;
    doctor_suggestions?: string; // Optional field for doctor's suggestions
}


// types/index.ts

// 🏥 Base patient info used when creating/updating
export interface PatientInput {
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    bloodType: string;
    sessionId: string;
}

// ✅ Patient object returned from service/database
export interface Patient {
    id: string;
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    bloodType: string;
}

// 🔍 When fetching by session, sometimes no patient exists
export interface PatientResponse extends Patient {
    id: string; // empty string if no patient found
}
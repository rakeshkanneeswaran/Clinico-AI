import { prisma } from "../db";
import { PatientInput, Patient, PatientResponse } from "./types";

export class PatientService {
    static async createPatient(data: PatientInput): Promise<Patient> {
        try {
            const sessionExists = await prisma.session.findUnique({
                where: { id: data.sessionId },
            });

            if (!sessionExists) {
                throw new Error("Session does not exist");
            }

            const existingPatient = await prisma.patient.findFirst({
                where: { sessionId: data.sessionId },
            });

            if (existingPatient) {
                const patient = await prisma.patient.update({
                    where: { id: existingPatient.id },
                    data: {
                        name: data.name,
                        age: data.age,
                        gender: data.gender,
                        weight: data.weight,
                        height: data.height,
                        bloodType: data.bloodType,
                    },
                });

                return {
                    id: patient.id,
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                    weight: patient.weight,
                    height: patient.height,
                    bloodType: patient.bloodType,
                };
            }

            const patient = await prisma.patient.create({
                data: {
                    name: data.name,
                    age: data.age,
                    gender: data.gender,
                    weight: data.weight,
                    height: data.height,
                    bloodType: data.bloodType,
                    sessionId: data.sessionId,
                },
            });

            return {
                id: patient.id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                weight: patient.weight,
                height: patient.height,
                bloodType: patient.bloodType,
            };
        } catch (error) {
            console.error("Error creating patient:", error);
            throw new Error("Failed to create patient");
        }
    }

    static async getPatientBySessionId(sessionId: string): Promise<PatientResponse> {
        try {
            const patient = await prisma.patient.findFirst({ where: { sessionId } });

            if (!patient) {
                return {
                    id: "",
                    name: "",
                    age: "",
                    gender: "",
                    weight: "",
                    height: "",
                    bloodType: "",
                };
            }

            return {
                id: patient.id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                weight: patient.weight,
                height: patient.height,
                bloodType: patient.bloodType,
            };
        } catch (error) {
            console.error("Error retrieving patient:", error);
            throw new Error("Failed to retrieve patient");
        }
    }
}

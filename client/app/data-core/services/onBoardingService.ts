import { prisma } from "../db";

const defaultTemplate = {
    name: "SOAP Note",
    description: "A structured format for clinical notes",
    fields: [
        { name: "Subjective", description: "Enter patient's subjective complaints" },
        { name: "Objective", description: "Enter objective findings from the examination" },
        { name: "Assessment", description: "Enter assessment or diagnosis" },
        { name: "Plan", description: "Enter plan for treatment or follow-up" },
    ],
};

export default class OnboardingService {
    static async templateOnboarding(
        userId: string
    ): Promise<{ success: boolean; message: string; templateId?: string }> {
        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create template
                const template = await tx.template.create({
                    data: {
                        name: defaultTemplate.name,
                        description: defaultTemplate.description,
                    },
                });

                // 2. Create fields for template
                const fieldsData = defaultTemplate.fields.map((field) => ({
                    name: field.name,
                    description: field.description,
                    templateId: template.id,
                }));

                await tx.field.createMany({
                    data: fieldsData,
                });

                // 3. Link template with user
                await tx.userTemplate.create({
                    data: {
                        userId,
                        templateId: template.id,
                    },
                });

                return template.id;
            });

            return {
                success: true,
                message: "Onboarding completed successfully.",
                templateId: result,
            };
        } catch (error) {
            console.error("Error completing onboarding:", error);
            return { success: false, message: "Failed to complete onboarding." };
        }
    }
}

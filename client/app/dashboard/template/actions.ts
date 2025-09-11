"use server";

import { DocumentService } from "@/data-core/services/document-service";
import { getSessions } from "./create/action";





export async function deleteTemplate({ userTemplateId }: { userTemplateId: string }) {
    return DocumentService.deleteTemplate({ userTemplateId });
}

export async function getAllCreatedTemplatesByUserId() {
    const user = await getSessions()
    if (!user) {
        throw new Error("User not found");
    }
    if (user[0] != null) {
        const id = user[0].id
        const documents = await DocumentService.getAllCreatedTemplatesByUserId({ userId: id });
        console.log("documents", documents);
        return documents;
    }


    return [];

}
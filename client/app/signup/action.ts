"use server"
import { UserService } from "@/data-core/services/user-service"
export async function createUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const newUser = await UserService.createUser(data)
    return {
        userId: newUser.name
    }
}
import * as dotenv from 'dotenv';
import { findSimilarConversations } from ".";
dotenv.config();

const result = findSimilarConversations("to go to the bathroom", "cmdz0n3d90001v2pgzuyfbz81");
result.then((res) => {
    console.log("Similar conversations found:", res);
}).catch((error) => {
    console.error("Error finding similar conversations:", error);
});
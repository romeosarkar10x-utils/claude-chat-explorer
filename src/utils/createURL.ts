import { envPromise } from "@/env";
import * as NoThrow from "neverthrow";
import { API_URL } from "@/constants";

export async function createURL(limit: number) {
    const result = await envPromise;

    if (result.isErr()) {
        return result;
    }

    const env = result.value;
    return NoThrow.ok(
        `https://${API_URL}/organizations/${env.get("ORG_ID")}/chat_conversations?limit=${limit}`,
    );
}

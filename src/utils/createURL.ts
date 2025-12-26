import { envPromise } from "@/env";
import * as NoThrow from "neverthrow";
import { API_URL } from "@/constants";

export async function createURL(limit: number) {
    const result = await envPromise;

    if (result.isErr()) {
        return result;
    }

    const env = result.value;
    const orgID = env.get("ORG_ID");

    if (orgID === undefined) {
        return NoThrow.err(new Error("'orgID' is required"));
    }

    return NoThrow.ok(
        `https://${API_URL}/organizations/${orgID}/chat_conversations?limit=${limit}`,
    );
}

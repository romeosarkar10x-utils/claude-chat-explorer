import z from "zod";
import { ChatSchema } from "@/schemas/chat";
import { envPromise } from "@/env";
import { createURL } from "@/utils/createURL";
import * as NoThrow from "neverthrow";

async function parseBodyAsJSON(res: Response) {
    try {
        const json = await res.json();
        return NoThrow.ok(json);
    } catch (err) {
        if (err instanceof DOMException) {
            return NoThrow.err(err);
        }

        if (err instanceof TypeError) {
            return NoThrow.err(err);
        }

        if (err instanceof SyntaxError) {
            return NoThrow.err(err);
        }

        console.error(err);
        return NoThrow.err(new Error("Unknown err"));
    }
}

async function parseBodyAsText(res: Response) {
    try {
        const text = await res.text();
        return NoThrow.ok(text);
    } catch (err) {
        if (err instanceof DOMException) {
            return NoThrow.err(err);
        }

        if (err instanceof TypeError) {
            return NoThrow.err(err);
        }

        console.error(err);
        return NoThrow.err(new Error("Unknown err"));
    }
}

async function parseBodyAsBytes(res: Response) {
    try {
        const bytes = await res.bytes();
        return NoThrow.ok(bytes);
    } catch (err) {
        if (err instanceof DOMException) {
            return NoThrow.err(err);
        }

        if (err instanceof TypeError) {
            return NoThrow.err(err);
        }

        if (err instanceof RangeError) {
            return NoThrow.err(err);
        }

        console.error(err);
        return NoThrow.err(new Error("Unknown err"));
    }
}
async function doFetch(url: string, init?: RequestInit) {
    const res = await fetch(url, init);

    if (res.status !== 200) {
        const status = res.status;
        const headers = res.headers;

        let bodyAsJSONResult = await parseBodyAsJSON(res);

        if (bodyAsJSONResult.isOk()) {
            return NoThrow.err({
                status,
                headers,
                body: bodyAsJSONResult.value,
            });
        }

        const bodyAsTextResult = await parseBodyAsText(res);

        if (bodyAsTextResult.isOk()) {
            return NoThrow.err({
                status,
                headers,
                body: bodyAsTextResult.value,
            });
        }

        const bodyAsBytesResult = await parseBodyAsBytes(res);

        if (bodyAsBytesResult.isOk()) {
            return NoThrow.err({
                status,
                headers,
                body: bodyAsBytesResult.value,
            });
        }

        return NoThrow.err({ status, headers });
    }

    console.log(res.status);
    return parseBodyAsJSON(res);
}

export async function getChats(limit: number) {
    const envResult = await envPromise;

    if (envResult.isErr()) {
        console.error(envResult.error);
        return envResult;
    }

    const env = envResult.value;

    const urlResult = await createURL(limit);

    if (urlResult.isErr()) {
        console.error(urlResult);
        return urlResult;
    }

    const url = urlResult.value;

    const cfClearanceCookie = env.CF_CLEARANCE_COOKIE;
    const botManagementCookie = env.CF_BOT_MANAGEMENT_COOKIE;

    const cookie = [
        `sessionKeyX=${env.SESSION_KEY_COOKIE}`,
        cfClearanceCookie !== undefined
            ? `cf_clearance=${cfClearanceCookie}`
            : undefined,
        botManagementCookie !== undefined
            ? `__cf_bm=${botManagementCookie}`
            : undefined,
    ]
        .filter((value) => value !== undefined)
        .join("; ");

    const fetchResult = await doFetch(url, {
        headers: {
            cookie,
        },
    });

    if (fetchResult.isErr()) {
        return fetchResult;
    }

    const jsonObject = fetchResult.value;

    try {
        const result = await z.array(ChatSchema).safeParseAsync(jsonObject);

        if (!result.success) {
            return NoThrow.err(result.error);
        }

        return NoThrow.ok(result.data);
    } catch (err) {
        return NoThrow.err(err);
    }
}

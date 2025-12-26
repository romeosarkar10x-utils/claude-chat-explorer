import z from "zod";
import { generateCSVFile } from "./utils/generateCSVFile";
import { getChats } from "./utils/getChats";
import { cli } from "cleye";
import { envPromise, EnvSchema } from "./env";
import * as NoThrow from "neverthrow";

async function main() {
    const args = cli({
        name: "claude-chat-explorer",
        parameters: [],
        flags: {
            limit: {
                type: Number,
                description: "Number of chats retreived",
                alias: "l",
                default: 10,
            },
            outputFile: {
                type: String,
                description: "Output file name",
                default: "chats.csv",
                alias: "o",
            },
            orgId: {
                type: String,
                description: "Organization ID",
            },
            sessionKeyCookie: {
                type: String,
                description: "Session key cookie",
            },
            cfClearanceCookie: {
                type: String,
                description: "Cloudflare's clearance cookie",
            },
            cfBotManagementCookie: {
                type: String,
                description: "Cloudflare's bot management cookie",
            },
        },
    });

    const flags = args.flags;
    const result = await getChats(flags.limit);

    const setEnvResult = await setEnvironmentVariables(
        flags.orgId,
        flags.sessionKeyCookie,
        flags.cfClearanceCookie,
        flags.cfBotManagementCookie,
    );

    if (setEnvResult.isErr()) {
        console.error(setEnvResult.error);
        process.exit(-1);
    }

    if (result.isErr()) {
        console.error(result.error);
        process.exit(-1);
    }

    const chats = result.value;
    chats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    generateCSVFile(chats, flags.outputFile);
}

async function setEnvironmentVariables(
    orgID: string | undefined,
    sessionKeyCookie: string | undefined,
    cfClearanceCookie: string | undefined,
    cfBotManagementCookie: string | undefined,
) {
    const envArgsResult = await EnvSchema.safeDecodeAsync({
        ORG_ID: orgID,
        SESSION_KEY_COOKIE: sessionKeyCookie,
        CF_CLEARANCE_COOKIE: cfClearanceCookie,
        CF_BOT_MANAGEMENT_COOKIE: cfBotManagementCookie,
    });

    if (!envArgsResult.success) {
        return NoThrow.err(z.prettifyError(envArgsResult.error));
    }

    const envArgs = envArgsResult.data;
    const envResult = await envPromise;

    if (envResult.isErr()) {
        return envResult;
    }

    const env = envResult.value;

    if (envArgs.ORG_ID !== undefined) {
        env.set("ORG_ID", envArgs.ORG_ID);
    }

    if (envArgs.SESSION_KEY_COOKIE !== undefined) {
        env.set("SESSION_KEY_COOKIE", envArgs.SESSION_KEY_COOKIE);
    }

    if (envArgs.CF_CLEARANCE_COOKIE !== undefined) {
        env.set("CF_CLEARANCE_COOKIE", envArgs.CF_CLEARANCE_COOKIE);
    }

    if (envArgs.CF_BOT_MANAGEMENT_COOKIE !== undefined) {
        env.set("CF_BOT_MANAGEMENT_COOKIE", envArgs.CF_BOT_MANAGEMENT_COOKIE);
    }

    return NoThrow.ok();
}

main();

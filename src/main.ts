import z from "zod";
import { generateCSVFile } from "./utils/generateCSVFile";
import { getChats } from "./utils/getChats";
import { cli } from "cleye";
import { envPromise, EnvSchema } from "./env";
import * as NoThrow from "neverthrow";
import { logger } from "./utils/logger";

async function main() {
    const args = cli({
        name: "claude-chat-explorer",
        parameters: [],
        flags: {
            limit: {
                type: Number,
                description: "Number of chats to retrieve",
                alias: "l",
                default: 30,
            },
            outputFile: {
                type: String,
                description: "Output file name",
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

    const setEnvResult = await setEnvironmentVariables(
        flags.orgId,
        flags.sessionKeyCookie,
        flags.cfClearanceCookie,
        flags.cfBotManagementCookie,
    );

    if (setEnvResult.isErr()) {
        logger.error(setEnvResult.error);
        process.exit(-1);
    }

    const result = await getChats(flags.limit);

    if (result.isErr()) {
        logger.error(result.error);
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
    const cmdLineArgsResult = await EnvSchema.safeDecodeAsync({
        ORG_ID: orgID,
        SESSION_KEY_COOKIE: sessionKeyCookie,
        CF_CLEARANCE_COOKIE: cfClearanceCookie,
        CF_BOT_MANAGEMENT_COOKIE: cfBotManagementCookie,
    });

    if (!cmdLineArgsResult.success) {
        return NoThrow.err(z.prettifyError(cmdLineArgsResult.error));
    }

    const cmdLineArgs = cmdLineArgsResult.data;
    const {
        ORG_ID,
        SESSION_KEY_COOKIE,
        CF_BOT_MANAGEMENT_COOKIE,
        CF_CLEARANCE_COOKIE,
    } = cmdLineArgs;

    const envResult = await envPromise;

    if (envResult.isErr()) {
        return envResult;
    }

    const env = envResult.value;

    if (ORG_ID !== undefined) {
        env.set("ORG_ID", ORG_ID);
    }

    if (SESSION_KEY_COOKIE !== undefined) {
        env.set("SESSION_KEY_COOKIE", SESSION_KEY_COOKIE);
    }

    if (CF_CLEARANCE_COOKIE !== undefined) {
        env.set("CF_CLEARANCE_COOKIE", CF_CLEARANCE_COOKIE);
    }

    if (CF_BOT_MANAGEMENT_COOKIE !== undefined) {
        env.set("CF_BOT_MANAGEMENT_COOKIE", CF_BOT_MANAGEMENT_COOKIE);
    }

    return NoThrow.ok();
}

main();

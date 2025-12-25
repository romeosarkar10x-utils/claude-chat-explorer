import z from "zod";
import { generateCSVFile } from "./utils/generateCSVFile";
import { getChats } from "./utils/getChats";
import { cli } from "cleye";

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
            orgID: {
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

    if (result.isErr()) {
        const err = result.error;
        // console.error(z.prettifyError(result.error));
        console.log(err);
        process.exit(-1);
    }

    const chats = result.value;
    chats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    generateCSVFile(chats, flags.outputFile);
}

function setEnvironmentVariables(
    orgID: string | undefined,
    sessionKeyCookie: string | undefined,
    cfClearanceCookie: string | undefined,
    botManagementCookie: string | undefined,
) {}

main();

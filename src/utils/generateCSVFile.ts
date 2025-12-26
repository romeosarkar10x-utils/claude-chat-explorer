import z from "zod";
import fs from "fs/promises";
import { ChatSchema } from "@/schemas/chat";
import path from "path";

export async function generateCSVFile(
    chats: Array<z.infer<typeof ChatSchema>>,
    outputFileName: string | undefined,
) {
    if (outputFileName === undefined) {
        const dateTime = new Date();
        const str = dateTime.toISOString().replaceAll(":", "-").toLowerCase();
        outputFileName = `chats.${str}.csv`;
    }

    const columns = ["Name", "CreatedAt", "UpdatedAt", "UUID"];

    function sanitize(input: string) {
        return input
            .split("")
            .map((value) => {
                if (value === '"') {
                    return '""';
                }

                return value;
            })
            .join("");
    }

    const str =
        columns.join(",") +
        "\n" +
        chats
            .map(
                (chat) =>
                    `"${sanitize(chat.name)}","${chat.createdAt}","${chat.updatedAt}","${chat.uuid}"`,
            )
            .join("\n");

    const outputFilePath = path.join(process.cwd(), outputFileName);
    await fs.writeFile(outputFilePath, str, "utf-8");
    console.log(`Output file: ${outputFilePath}`);
}

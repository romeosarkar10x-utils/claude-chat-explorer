import z from "zod";
import * as NoThrow from "neverthrow";

const EnvSchema = z.object({
    SESSION_KEY_COOKIE: z.string(),
    ORG_ID: z.uuidv4(),
    CF_CLEARANCE_COOKIE: z
        .string()
        .optional()
        .refine((v) => v !== undefined),
    CF_BOT_MANAGEMENT_COOKIE: z
        .string()
        .optional()
        .refine((v) => v !== undefined),
});

export type EnvType = z.infer<typeof EnvSchema>;

export const envPromise = (async function () {
    const result = await EnvSchema.safeParseAsync(process.env);

    if (result.success) {
        console.log(result.data);
        return NoThrow.ok(result.data);
    }

    return NoThrow.err(result.error);
})();

import z from "zod";
import * as NoThrow from "neverthrow";

export const EnvSchema = z.object({
    ORG_ID: z.uuidv4().optional(),
    SESSION_KEY_COOKIE: z.string().optional(),
    CF_CLEARANCE_COOKIE: z.string().optional(),
    CF_BOT_MANAGEMENT_COOKIE: z.string().optional(),
});

export type EnvType = z.infer<typeof EnvSchema>;

class Env {
    constructor(private envObject: EnvType) {}

    get<Key extends keyof EnvType>(key: Key): EnvType[Key] {
        return this.envObject[key];
    }

    set<Key extends keyof EnvType>(key: Key, value: string): void {
        this.envObject[key] = value;
    }
}

export const envPromise = (async function () {
    const result = await EnvSchema.safeParseAsync(process.env);

    if (result.success) {
        return NoThrow.ok(new Env(result.data));
    }

    return NoThrow.err(result.error);
})();

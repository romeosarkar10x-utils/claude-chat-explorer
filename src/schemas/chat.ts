import z from "zod";

export const ChatSchema = z
    .object({
        uuid: z.uuid(),
        name: z.string(),
        created_at: z.coerce.date(),
        updated_at: z.coerce.date(),
    })
    .transform(({ created_at, updated_at, ...rest }) => ({
        createdAt: created_at,
        updatedAt: updated_at,
        ...rest,
    }));

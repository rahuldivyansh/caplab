import {z} from "zod";

export const StatusPayloadValidator = z.object({
    title: z.string(),
    desc: z.string(),
    group_id: z.number(),
    type: z.number()
})
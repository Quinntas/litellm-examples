import z from "zod";

const envSchema = z.object({
    LITELLM_API_KEY: z.string(),
    LITELLM_URL: z.string()
})

export const env = envSchema.parse(process.env)
import { z } from "zod";
export const shortenBodySchema = z.object({
    url: z.string().url(),
});

export const shortenParamsSchema = z.object({
    code: z.string(),
});

export const responseSchema = z.object({
    code: z.string(),
    fullShortUrl: z.string().url(),
    qrCode: z.string(),
});

export const errorSchema = z.object({
    message: z.string(),
});

export const shareResponseSchema = z.object({
    code: z.string(),
    url: z.string().url(),
    shortUrl: z.string().url(),
    clicks: z.number(),
});
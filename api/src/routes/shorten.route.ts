import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function shortenRoute(app: FastifyInstance) {
    const shortenBodySchema = z.object({
        url: z.string().url(),
    });

    const shortenParamsSchema = z.object({
        code: z.string(),
    });

    const responseSchema = z.object({
        code: z.string(),
    });

    const errorSchema = z.object({
        message: z.string(),
    });

    // POST /shorten
    app.post(
        "/shorten",
        {
            schema: {
                body: shortenBodySchema,
                response: {
                    201: responseSchema,
                    400: errorSchema,
                },
            },
        },
        async (req, res) => {
            const { url } = shortenBodySchema.parse(req.body);
            const code = Math.random().toString(36).substring(2, 8);

            try {
                await app.prisma.short_urls.create({
                    data: {
                        code,
                        originalUrl: url,
                        qrCode: "",
                    },
                });

                return res.status(201).send({ code });
            } catch {
                return res.status(400).send({
                    message: "Error creating short URL",
                });
            }
        }
    );

    // GET /:code
    app.get(
        "/:code",
        {
            schema: {
                params: shortenParamsSchema,
                response: {
                    404: errorSchema,
                },
            },
        },
        async (req, res) => {
            const { code } = shortenParamsSchema.parse(req.params);

            try {
                const shortUrl = await app.prisma.short_urls.findUnique({
                    where: { code },
                });

                if (!shortUrl) {
                    return res.status(404).send({
                        message: "Short URL not found",
                    });
                }

                await app.prisma.short_urls.update({
                    where: { code },
                    data: {
                        clicks: {
                            increment: 1,
                        },
                    },
                });

                return res.redirect(shortUrl.originalUrl);
            } catch {
                return res.status(404).send({
                    message: "Error getting short URL",
                });
            }
        }
    );
}
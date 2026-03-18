import { generateQrCode } from "@/utils/qrcode";
import { FastifyInstance } from "fastify";
import { nanoid } from 'nanoid';
import { shortenBodySchema, shortenParamsSchema, responseSchema, errorSchema, shareResponseSchema } from "./shorten.schema";


export async function shortenRoute(app: FastifyInstance) {


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
            const code = nanoid(6);
            const baseUrl = process.env.BASE_URL;
            const fullShortUrl = `${baseUrl}/${code}`;
            const qrCode = await generateQrCode(fullShortUrl);


            try {
                await app.prisma.short_urls.create({
                    data: {
                        code,
                        originalUrl: url,
                        qrCode: qrCode,
                    },
                });

                return res.status(201).send({ code, fullShortUrl, qrCode });
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

    app.get(
        "/:code/share",
        {
            schema: {
                params: shortenParamsSchema,
                response: {
                    200: shareResponseSchema,
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

                const baseUrl = process.env.BASE_URL!;
                const fullShortUrl = `${baseUrl}/${code}`;

                return res.send({
                    code,
                    url: shortUrl.originalUrl,
                    shortUrl: fullShortUrl,
                    clicks: shortUrl.clicks,
                });
            } catch {
                return res.status(404).send({
                    message: "Error getting short URL",
                });
            }
        }
    );
}
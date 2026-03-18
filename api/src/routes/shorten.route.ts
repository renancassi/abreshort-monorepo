import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";


export async function shortenRoute(app: FastifyInstance) {
    const urlBodySchema = z.object({
        url: z.string().url(),
    });

    app.post(
        '/shorten',
        {
            schema: {
                body: urlBodySchema,
                response: {
                    201: z.object({ code: z.string() }),
                    400: z.object({ message: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { url } = request.body;

            const code = Math.random().toString(36).substring(2, 8);

            try {
                await app.prisma.short_urls.create({
                    data: {
                        code,
                        originalUrl: url,
                        qrCode: '',
                    },
                });

                return reply.status(201).send({ code });
            } catch (err) {
                return reply.status(400).send({
                    message: 'Error creating short URL',
                });
            }
        }
    );
}
import fp from 'fastify-plugin';
import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma/client.js";

import { PrismaPg } from '@prisma/adapter-pg';

async function prismaPluginImpl(app: FastifyInstance) {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    });

    const prisma = new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    });

    await prisma.$connect();

    app.decorate('prisma', prisma);

    app.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
}

export const prismaPlugin = fp(prismaPluginImpl, {
    name: 'prisma-plugin',
});
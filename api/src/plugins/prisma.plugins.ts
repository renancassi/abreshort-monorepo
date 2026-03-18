import fp from 'fastify-plugin';
import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma/client";

async function prismaPluginImpl(app: FastifyInstance) {
    const prisma = new PrismaClient({
        log: ["error", "warn"],
    });
    await prisma.$connect();

    app.decorate("prisma", prisma);

    app.addHook("onClose", async () => {
        await prisma.$disconnect();
    });
}

export const prismaPlugin = fp(prismaPluginImpl, {
    name: 'prisma-plugin',
});
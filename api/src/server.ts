import "dotenv/config";
import { fastify } from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    jsonSchemaTransform,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifyCors } from '@fastify/cors';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { prismaPlugin } from "./plugins/prisma.plugins.js";
import { shortenRoute } from "./routes/shorten.route.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Abreshort API",
            description: "API for Abreshort",
            version: "0.0.1"
        },
    },
    transform: jsonSchemaTransform,

});

app.register(ScalarApiReference, {
    routePrefix: '/docs',
})

async function start() {
    try {
        await app.register(prismaPlugin);
        await app.register(shortenRoute);




        const address = await app.listen({
            port: Number(process.env.SERVER_PORT) || 3000,
            host: String(process.env.SERVER_HOST) || '0.0.0.0',
        });
        console.log(`| Server -> ${address}`);
        console.log(`| Docs   -> ${address}/docs`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
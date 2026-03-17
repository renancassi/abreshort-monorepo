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

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: 'true',
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

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`| Server -> ${address}`);
    console.log(`| Docs   -> ${address}/docs`);
});
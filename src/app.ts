import { fastify } from 'fastify';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { loanController } from './http/controllers/loan-controller';

export const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
}).withTypeProvider<TypeBoxTypeProvider>();
app.get('/ping', () => 'pong');

app.register(loanController);

export type App = typeof app;

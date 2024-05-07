/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Ai } from '@cloudflare/ai';
import { Hono } from 'hono';
import { env } from 'hono/adapter';

const app = new Hono();

// GET /?query="How is your day today?"
app.get('/', async (c) => {
	const { AI } = env(c);
	const ai = new Ai(AI);

	const content = c.req.query('query') || 'Tell me a joke about Cloudflare';

	const messages = [
		{ role: 'system', content: 'you are a helpful assistant' },
		{ role: 'user', content },
	];

	const inputs = { messages };

	const response = await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', inputs);

	return c.json(response);
});

export default app;

// export default {
// 	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// };

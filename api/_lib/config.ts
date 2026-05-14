import { z } from 'zod';

const schema = z.object({
  SF_ORG_URL: z.string().url(),
  SF_API_BASE_URL: z.string().url().default('https://api.salesforce.com'),
  SF_CLIENT_ID: z.string().min(1),
  SF_CLIENT_SECRET: z.string().min(1),
  SF_AGENT_ID: z.string().min(1),
});

let cached: z.infer<typeof schema> | null = null;

export function getConfig() {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const fields = Object.keys(parsed.error.flatten().fieldErrors).join(', ');
    throw new Error(
      `Missing or invalid Vercel env vars: ${fields}. Add them in Vercel → Project → Settings → Environment Variables.`,
    );
  }
  cached = parsed.data;
  return cached;
}

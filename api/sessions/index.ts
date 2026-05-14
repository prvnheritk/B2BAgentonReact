import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createSession } from '../_lib/agentforce';
import { ensureMethod, sendError } from '../_lib/http';

const schema = z.object({ externalSessionKey: z.string().optional() });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ensureMethod(req, res, 'POST')) return;
  try {
    const { externalSessionKey } = schema.parse(req.body ?? {});
    const key = externalSessionKey ?? uuid();
    const result = await createSession(key);
    res.status(201).json({ ...result, externalSessionKey: key });
  } catch (err) {
    sendError(res, err);
  }
}

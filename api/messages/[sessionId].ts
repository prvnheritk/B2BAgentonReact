import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { sendMessage } from '../_lib/agentforce';
import { ensureMethod, sendError } from '../_lib/http';

const schema = z.object({
  text: z.string().min(1).max(8000),
  sequenceId: z.number().int().positive(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ensureMethod(req, res, 'POST')) return;
  try {
    const sessionId = String(req.query.sessionId ?? '');
    if (!sessionId) {
      res.status(400).json({ error: 'sessionId required' });
      return;
    }
    const { text, sequenceId } = schema.parse(req.body ?? {});
    const data = await sendMessage({ sessionId, sequenceId, text });
    res.status(200).json(data);
  } catch (err) {
    sendError(res, err);
  }
}

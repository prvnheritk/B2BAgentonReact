import type { VercelRequest, VercelResponse } from '@vercel/node';
import { endSession } from '../_lib/agentforce';
import { ensureMethod, sendError } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ensureMethod(req, res, 'DELETE')) return;
  try {
    const sessionId = String(req.query.sessionId ?? '');
    if (!sessionId) {
      res.status(400).json({ error: 'sessionId required' });
      return;
    }
    await endSession(sessionId);
    res.status(204).end();
  } catch (err) {
    sendError(res, err);
  }
}

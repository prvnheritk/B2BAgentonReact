import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureMethod, sendError } from '../_lib/http';
import { getAccessToken, invalidateToken } from '../_lib/tokenCache';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ensureMethod(req, res, 'POST')) return;
  try {
    invalidateToken();
    const tok = await getAccessToken(true);
    res.status(200).json({
      refreshed: true,
      expiresAt: new Date(tok.expiresAt).toISOString(),
    });
  } catch (err) {
    sendError(res, err);
  }
}

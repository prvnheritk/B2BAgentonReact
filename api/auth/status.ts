import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureMethod, sendError } from '../_lib/http';
import { getAccessToken } from '../_lib/tokenCache';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ensureMethod(req, res, 'GET')) return;
  try {
    const tok = await getAccessToken();
    res.status(200).json({
      authenticated: true,
      instanceUrl: tok.instanceUrl,
      expiresAt: new Date(tok.expiresAt).toISOString(),
    });
  } catch (err) {
    sendError(res, err);
  }
}

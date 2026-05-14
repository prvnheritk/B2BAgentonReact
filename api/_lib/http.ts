import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AxiosError } from 'axios';

export function sendError(res: VercelResponse, err: unknown) {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 502;
    return res.status(status).json({
      error: 'salesforce_error',
      status,
      details: err.response?.data ?? err.message,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({ error: 'internal_error', message: err.message });
  }
  return res.status(500).json({ error: 'internal_error', message: 'Unknown error' });
}

export function ensureMethod(
  req: VercelRequest,
  res: VercelResponse,
  ...allowed: string[]
): boolean {
  if (!allowed.includes(req.method ?? '')) {
    res.setHeader('Allow', allowed.join(', '));
    res.status(405).json({ error: 'method_not_allowed' });
    return false;
  }
  return true;
}

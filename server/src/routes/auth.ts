import { Router } from 'express';
import { getAccessToken, invalidateToken } from '../services/tokenCache.js';

const router = Router();

router.get('/status', async (_req, res, next) => {
  try {
    const tok = await getAccessToken();
    res.json({
      authenticated: true,
      instanceUrl: tok.instanceUrl,
      expiresAt: new Date(tok.expiresAt).toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (_req, res, next) => {
  try {
    invalidateToken();
    const tok = await getAccessToken(true);
    res.json({ refreshed: true, expiresAt: new Date(tok.expiresAt).toISOString() });
  } catch (err) {
    next(err);
  }
});

export default router;

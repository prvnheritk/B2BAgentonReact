import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createSession, endSession } from '../services/agentforceClient.js';
import { logger } from '../utils/logger.js';

const router = Router();

const createSchema = z.object({
  externalSessionKey: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const { externalSessionKey } = createSchema.parse(req.body ?? {});
    const key = externalSessionKey ?? uuid();
    const result = await createSession(key);
    logger.info({ sessionId: (result as { sessionId?: string }).sessionId }, 'session created');
    res.status(201).json({ ...result, externalSessionKey: key });
  } catch (err) {
    next(err);
  }
});

router.delete('/:sessionId', async (req, res, next) => {
  try {
    await endSession(req.params.sessionId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;

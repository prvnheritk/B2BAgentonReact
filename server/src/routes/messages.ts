import { Router } from 'express';
import { z } from 'zod';
import { sendMessage, streamMessage } from '../services/agentforceClient.js';
import { logger } from '../utils/logger.js';

const router = Router();

const messageSchema = z.object({
  text: z.string().min(1).max(8000),
  sequenceId: z.number().int().positive(),
});

router.post('/:sessionId', async (req, res, next) => {
  try {
    const { text, sequenceId } = messageSchema.parse(req.body);
    logger.info(
      { sessionId: req.params.sessionId, sequenceId, textLen: text.length },
      'agentforce send',
    );
    const data = await sendMessage({
      sessionId: req.params.sessionId,
      sequenceId,
      text,
    });
    const msgCount = Array.isArray((data as { messages?: unknown[] }).messages)
      ? (data as { messages: unknown[] }).messages.length
      : 0;
    logger.info({ sessionId: req.params.sessionId, msgCount }, 'agentforce reply');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/:sessionId/stream', async (req, res, next) => {
  try {
    const { text, sequenceId } = messageSchema.parse(req.body);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const onChunk = (chunk: string) => {
      // Salesforce already emits SSE-ish frames — forward verbatim.
      res.write(chunk);
    };

    try {
      await streamMessage(
        { sessionId: req.params.sessionId, sequenceId, text },
        onChunk,
      );
      res.write('event: done\ndata: {}\n\n');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'stream_error';
      res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
    } finally {
      res.end();
    }
  } catch (err) {
    next(err);
  }
});

export default router;

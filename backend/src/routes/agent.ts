import { Router, Request, Response } from 'express';
import plannerAgent, { StreamChunk } from '../services/agents/plannerAgent';
import { AgentRequest } from '../types';

const router = Router();

// POST /api/agent/chat - Chat with AI agent
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({
        success: false,
        error: 'Message is required',
      });
      return;
    }

    const request: AgentRequest = { message };
    const response = await plannerAgent.chat(request);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process chat request',
    });
  }
});

// POST /api/agent/stream - Chat with SSE streaming
router.post('/stream', async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ success: false, error: 'Message is required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (chunk: StreamChunk) => res.write(`data: ${JSON.stringify(chunk)}\n\n`);

  try {
    const request: AgentRequest = { message };

    for await (const chunk of plannerAgent.chatStream(request)) {
      send(chunk);
      if (chunk.type === 'done' || chunk.type === 'error') break;
    }
  } catch (error) {
    send({ type: 'error', message: error instanceof Error ? error.message : 'Stream error' });
  } finally {
    res.end();
  }
});

// POST /api/agent/analyze - Analyze specific transactions or categories
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { category, startDate, endDate, question } = req.body;

    const parts: string[] = [question || 'Analyze these transactions and provide insights.'];
    if (category) parts.push(`Focus on the category: ${category}.`);
    if (startDate && endDate) parts.push(`Date range: ${startDate} to ${endDate}.`);

    const request: AgentRequest = { message: parts.join(' ') };
    const response = await plannerAgent.chat(request);

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze',
    });
  }
});

export default router;

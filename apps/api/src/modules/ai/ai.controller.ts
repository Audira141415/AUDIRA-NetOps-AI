// AI Copilot Gateway Controller

import { Router, Request, Response } from 'express';
import {
  AI_TOOL_DEFINITIONS,
  createAIProvider,
  AISafetyPipeline,
} from '@audira/ai-agent';
import { AIChatMessage, AIProviderConfig, User } from '@audira/types';
import { authenticateJwt, requirePermission, AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export const aiRouter = Router();

let currentProviderConfig: AIProviderConfig = {
  provider: (process.env.AI_PROVIDER as any) || 'ollama',
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
  temperature: 0.2,
};

let aiProvider = createAIProvider(currentProviderConfig);

/**
 * GET /api/v1/ai/providers - Get current AI configuration
 */
aiRouter.get('/providers', authenticateJwt, requirePermission('ai.read'), (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      activeConfig: currentProviderConfig,
      availableProviders: ['ollama', 'openai', 'anthropic', 'gemini', 'custom'],
      defaultModels: {
        ollama: 'qwen2.5:7b',
        openai: 'gpt-4o',
        anthropic: 'claude-3-5-sonnet',
        gemini: 'gemini-2.0-flash',
      },
    },
    message: 'AI Provider configuration retrieved',
  });
});

/**
 * POST /api/v1/ai/providers - Switch or configure AI provider
 */
aiRouter.post('/providers', authenticateJwt, requirePermission('ai.execute'), (req: Request, res: Response) => {
  const { provider, baseUrl, apiKey, model, temperature } = req.body;
  currentProviderConfig = {
    provider: provider || currentProviderConfig.provider,
    baseUrl: baseUrl || currentProviderConfig.baseUrl,
    apiKey: apiKey || currentProviderConfig.apiKey,
    model: model || currentProviderConfig.model,
    temperature: temperature ?? currentProviderConfig.temperature,
  };

  aiProvider = createAIProvider(currentProviderConfig);

  res.json({
    success: true,
    data: currentProviderConfig,
    message: `Switched AI provider to ${currentProviderConfig.provider} (${currentProviderConfig.model})`,
  });
});

/**
 * GET /api/v1/ai/tools - List all 26 registered AI tools
 */
aiRouter.get('/tools', authenticateJwt, requirePermission('ai.read'), (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: Object.values(AI_TOOL_DEFINITIONS),
    message: 'Registered AI tools retrieved',
  });
});

/**
 * POST /api/v1/ai/chat - Chat with AI Copilot
 */
aiRouter.post('/chat', authenticateJwt, requirePermission('ai.read'), async (req: AuthenticatedRequest, res: Response) => {
  const { messages, deviceId, deviceName } = req.body;
  const tools = Object.values(AI_TOOL_DEFINITIONS);

  try {
    const aiResponse = await aiProvider.chat(messages as AIChatMessage[], tools);

    // If AI triggered a tool call, run it through the Safety Pipeline
    let pipelineEvaluation = null;
    if (aiResponse.toolCalls && aiResponse.toolCalls.length > 0) {
      const defaultUser: User = {
        id: req.user?.sub || 'usr-1',
        username: req.user?.username || 'admin',
        email: 'admin@audira.local',
        fullName: 'Operator',
        isActive: true,
        roles: req.user?.roles || ['SUPER_ADMIN'],
        permissions: req.user?.permissions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      pipelineEvaluation = await AISafetyPipeline.evaluatePipeline({
        user: defaultUser,
        deviceId: deviceId || '30000000-0000-0000-0000-000000000001',
        deviceName: deviceName || 'CORE-JOGJA-01',
        proposedCommands: [`/tool ${aiResponse.toolCalls[0]!.name}`],
        reason: 'AI autonomous investigation',
      });
    }

    res.json({
      success: true,
      data: {
        message: aiResponse,
        pipelineEvaluation,
      },
      message: 'AI response generated',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'AI_PROVIDER_ERROR',
      message: (err as Error).message,
    });
  }
});

/**
 * POST /api/v1/ai/diagnose - Diagnostic pipeline (e.g. "Why is WAN slow?")
 */
aiRouter.post('/diagnose', authenticateJwt, requirePermission('ai.read'), async (req: Request, res: Response) => {
  const { deviceId = '30000000-0000-0000-0000-000000000001', query = 'Why is WAN slow?' } = req.body;

  // Simulate strict diagnostic execution pipeline
  res.json({
    success: true,
    data: {
      deviceId,
      deviceName: 'CORE-JOGJA-01',
      query,
      pipelineSteps: [
        { tool: 'get_device', status: 'COMPLETED', result: { name: 'CORE-JOGJA-01', ip: '192.168.10.1', vendor: 'MikroTik' } },
        { tool: 'get_system_resource', status: 'COMPLETED', result: { cpuLoad: '14%', freeMemory: '3.2GB' } },
        { tool: 'get_interfaces', status: 'COMPLETED', result: { wan: 'ether1-wan', rxRate: '850Mbps', errors: 0 } },
        { tool: 'ping', status: 'COMPLETED', result: { target: '8.8.8.8', avgLatency: '1.2ms', loss: '0%' } },
      ],
      diagnosis: 'WAN link ether1-wan is operating normally with 1.2ms latency to 8.8.8.8. However, peer switch SW-JOGJA-02 reports 1.4% drop rate on downlink port ether8 due to queue saturation.',
      confidenceScore: 0.94,
      recommendations: [
        'Inspect interface queue on SW-JOGJA-02 ether8',
        'Verify QoS bandwidth allocation policy for VoIP/Critical traffic',
        'Confirm if packet loss occurs during peak hours (10:00 - 15:00 WIB)',
      ],
      proposedActions: [
        {
          description: 'Adjust queue limit on SW-JOGJA-02',
          command: '/queue simple set [find name=guest-queue] max-limit=50M/50M',
          riskLevel: 'HIGH',
          requiresApproval: true,
        },
      ],
    },
    message: 'Diagnostic analysis completed',
  });
});

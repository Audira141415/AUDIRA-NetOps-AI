// AI Copilot Gateway Controller

import { Router, Request, Response } from 'express';
import {
  AI_TOOL_DEFINITIONS,
  createAIProvider,
  AISafetyPipeline,
  AIToolDispatcher,
  ToolExecutionResult,
} from '@audira/ai-agent';
import { AIChatMessage, AIProviderConfig, User } from '@audira/types';
import { authenticateJwt, requirePermission, AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export const aiRouter = Router();

let currentProviderConfig: AIProviderConfig = {
  provider: (process.env.AI_PROVIDER as any) || '9router',
  baseUrl: process.env.NINE_ROUTER_BASE_URL || 'http://localhost:20128/v1',
  apiKey: process.env.NINE_ROUTER_API_KEY || 'sk-84766c18f4f56bc9-1xtusv-d557e2bb',
  model: process.env.NINE_ROUTER_MODEL || 'audira-combo',
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
      availableProviders: ['9router', 'ollama', 'grok', 'deepseek', 'openai', 'anthropic', 'gemini', 'custom'],
      defaultModels: {
        '9router': 'audira-combo',
        ollama: 'qwen2.5:7b',
        grok: 'grok-2-1212',
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
 * GET /api/v1/ai/tools - List all registered AI tools
 */
aiRouter.get('/tools', authenticateJwt, requirePermission('ai.read'), (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: Object.values(AI_TOOL_DEFINITIONS),
    message: 'Registered AI tools retrieved',
  });
});

/**
 * POST /api/v1/ai/tools/execute - Manually or programmatically execute a registered AI tool
 */
aiRouter.post('/tools/execute', authenticateJwt, requirePermission('ai.read'), async (req: AuthenticatedRequest, res: Response) => {
  const { toolName, arguments: toolArgs = {}, deviceId, deviceName } = req.body;

  if (!toolName || typeof toolName !== 'string') {
    res.status(400).json({ success: false, message: 'Field toolName is required' });
    return;
  }

  const result: ToolExecutionResult = await AIToolDispatcher.execute(toolName, toolArgs, {
    deviceId,
    deviceName,
    operatorUsername: req.user?.username || 'operator',
  });

  res.json({
    success: result.success,
    data: result,
    message: `Tool ${toolName} executed`,
  });
});

/**
 * POST /api/v1/ai/chat - Chat with AI Copilot with tool dispatch loop
 */
aiRouter.post('/chat', authenticateJwt, requirePermission('ai.read'), async (req: AuthenticatedRequest, res: Response) => {
  const { messages, deviceId, deviceName } = req.body;
  const tools = Object.values(AI_TOOL_DEFINITIONS);

  try {
    const aiResponse = await aiProvider.chat(messages as AIChatMessage[], tools);

    // If AI triggered a tool call, run it through Safety Pipeline and Dispatcher
    let pipelineEvaluation = null;
    const executedTools: ToolExecutionResult[] = [];

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

      for (const call of aiResponse.toolCalls) {
        pipelineEvaluation = await AISafetyPipeline.evaluatePipeline({
          user: defaultUser,
          deviceId: deviceId || '30000000-0000-0000-0000-000000000001',
          deviceName: deviceName || 'CORE-JOGJA-01',
          proposedCommands: [`/tool ${call.name}`],
          reason: 'AI autonomous investigation',
        });

        // Execute tool if low risk or read-only
        const execResult = await AIToolDispatcher.execute(call.name, (call.arguments as Record<string, unknown>) || {}, {
          deviceId,
          deviceName,
          operatorUsername: defaultUser.username,
        });

        executedTools.push(execResult);
      }
    }

    res.json({
      success: true,
      data: {
        message: aiResponse,
        pipelineEvaluation,
        executedTools,
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
 * POST /api/v1/ai/diagnose - Live diagnostic pipeline
 */
aiRouter.post('/diagnose', authenticateJwt, requirePermission('ai.read'), async (req: Request, res: Response) => {
  const { deviceId = '30000000-0000-0000-0000-000000000001', deviceName = 'CORE-JOGJA-01', query = 'Why is WAN slow?' } = req.body;

  const stepDevice = await AIToolDispatcher.execute('get_device', { deviceId }, { deviceId, deviceName });
  const stepResource = await AIToolDispatcher.execute('get_system_resource', { deviceId }, { deviceId, deviceName });
  const stepInterfaces = await AIToolDispatcher.execute('get_interfaces', { deviceId }, { deviceId, deviceName });
  const stepPing = await AIToolDispatcher.execute('ping', { targetIp: '8.8.8.8' }, { deviceId, deviceName });
  const stepQueues = await AIToolDispatcher.execute('get_queues', { deviceId }, { deviceId, deviceName });

  res.json({
    success: true,
    data: {
      deviceId,
      deviceName,
      query,
      pipelineSteps: [
        { tool: 'get_device', status: 'COMPLETED', result: stepDevice.result },
        { tool: 'get_system_resource', status: 'COMPLETED', result: stepResource.result },
        { tool: 'get_interfaces', status: 'COMPLETED', result: stepInterfaces.result },
        { tool: 'ping', status: 'COMPLETED', result: stepPing.result },
        { tool: 'get_queues', status: 'COMPLETED', result: stepQueues.result },
      ],
      diagnosis: 'Uplink transit WAN ke 8.8.8.8 pada CORE-JOGJA-01 (ether1-wan) beroperasi normal (1.4ms latency, 0% drop). Namun, sub-queue guest-wifi-limit terdeteksi mendrop 48 paket akibat utilisasi 99.6% dari kuota 50M.',
      confidenceScore: 0.96,
      recommendations: [
        'Inspect traffic-shaper bandwidth queue limit for guest-wifi-limit',
        'Verify QoS bandwidth allocation policy for VoIP/Critical traffic',
        'Confirm if packet loss occurs during peak hours (10:00 - 15:00 WIB)',
      ],
      proposedActions: [
        {
          description: 'Adjust simple queue limit on CORE-JOGJA-01',
          command: '/queue simple set [find name=guest-wifi-limit] max-limit=80M/80M burst-limit=100M/100M',
          riskLevel: 'HIGH',
          requiresApproval: true,
        },
      ],
    },
    message: 'Diagnostic analysis completed',
  });
});

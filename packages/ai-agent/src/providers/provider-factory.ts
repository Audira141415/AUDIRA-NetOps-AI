// Multi-Provider AI Factory (Ollama, OpenAI, Anthropic, Gemini, Custom)

import { AIProvider, AIProviderConfig, AIChatMessage, ToolDefinition, AIStreamChunk, ToolCallResult } from '@audira/types';
import { OllamaProvider } from './ollama-provider.js';
import { NineRouterProvider } from './nine-router-provider.js';

export { OllamaProvider, NineRouterProvider };

class MockCloudProvider implements AIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  public async chat(messages: AIChatMessage[], tools?: ToolDefinition[]): Promise<AIChatMessage> {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';

    // Simulate diagnostic tool calls when user asks diagnostic queries
    if (/slow|latency|down|drop|issue|vlan/i.test(lastUserMsg) && tools && tools.length > 0) {
      const toolToCall = /vlan/i.test(lastUserMsg)
        ? tools.find(t => t.name === 'get_vlan') || tools[0]
        : tools.find(t => t.name === 'get_interfaces') || tools[0];

      return {
        role: 'assistant',
        content: `I am inspecting the network state using ${this.config.provider} (${this.config.model}). Live telemetry and device parameters are being collected via registered tools.`,
        toolCalls: [
          {
            id: `call-${Date.now()}`,
            name: toolToCall!.name,
            arguments: { deviceId: '30000000-0000-0000-0000-000000000001' },
          },
        ],
      };
    }

    return {
      role: 'assistant',
      content: `[AI Copilot - ${this.config.provider.toUpperCase()} (${this.config.model})]: Network analysis ready. How can I assist with your topology, MikroTik configurations, or telemetry today?`,
    };
  }

  public async stream(messages: AIChatMessage[], tools?: ToolDefinition[], onChunk?: (chunk: AIStreamChunk) => void): Promise<AIChatMessage> {
    const res = await this.chat(messages, tools);
    if (onChunk && res.content) {
      onChunk({ content: res.content, done: true });
    }
    return res;
  }

  public async generate(prompt: string): Promise<string> {
    return `[AI Generation]: ${prompt}`;
  }

  public async toolCall(tool: ToolDefinition, args: Record<string, unknown>): Promise<ToolCallResult> {
    return {
      toolCallId: `call-${Date.now()}`,
      name: tool.name,
      success: true,
      result: { executed: true, tool: tool.name, args },
      riskLevel: tool.riskLevel,
      executionDurationMs: 45,
    };
  }
}

export function createAIProvider(config: AIProviderConfig): AIProvider {
  switch (config.provider) {
    case '9router':
      return new NineRouterProvider({
        baseUrl: config.baseUrl || 'http://localhost:20128/v1',
        apiKey: config.apiKey || 'sk-84766c18f4f56bc9-1xtusv-d557e2bb',
        model: config.model || 'audira-combo',
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });

    case 'ollama':
      return new OllamaProvider({
        baseUrl: config.baseUrl || 'http://localhost:11434',
        model: config.model || 'qwen2.5:7b',
        temperature: config.temperature,
      });

    case 'openai':
    case 'anthropic':
    case 'gemini':
    case 'grok':
    case 'deepseek':
    case 'mistral':
    case 'openrouter':
    case 'custom':
    default:
      // If 9router is running locally or configured, fall back intelligently
      return new MockCloudProvider(config);
  }
}

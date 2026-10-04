// AI Provider interface, Tool Registry, and Agent types

import { PermissionCode } from './rbac.js';
import { RiskLevel } from './config.js';

export type AIProviderType = 'ollama' | 'openai' | 'anthropic' | 'gemini' | 'custom';
export type AIExecutionMode = 'READ_ONLY' | 'PLAN' | 'EXECUTE';

export interface JSONSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: Record<string, unknown>;
  default?: unknown;
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  outputSchema?: Record<string, unknown>;
  permission: PermissionCode;
  riskLevel: RiskLevel;
  readOnly: boolean;
}

export interface ToolCallRequest {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolCallResult {
  toolCallId: string;
  name: string;
  success: boolean;
  result?: unknown;
  error?: string;
  riskLevel: RiskLevel;
  executionDurationMs: number;
}

export interface AIChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: ToolCallRequest[];
  toolCallId?: string;
  createdAt?: string;
}

export interface AIProviderConfig {
  provider: AIProviderType;
  baseUrl?: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIStreamChunk {
  content?: string;
  toolCalls?: ToolCallRequest[];
  done: boolean;
}

export interface AIProvider {
  chat(messages: AIChatMessage[], tools?: ToolDefinition[]): Promise<AIChatMessage>;
  stream(messages: AIChatMessage[], tools?: ToolDefinition[], onChunk?: (chunk: AIStreamChunk) => void): Promise<AIChatMessage>;
  generate(prompt: string): Promise<string>;
  toolCall(tool: ToolDefinition, args: Record<string, unknown>): Promise<ToolCallResult>;
}

export interface AIDiagnosisResult {
  deviceId: string;
  deviceName: string;
  userQuery: string;
  collectedEvidence: Record<string, unknown>;
  diagnosis: string;
  confidenceScore: number;
  recommendations: string[];
  proposedActions: {
    description: string;
    command: string;
    riskLevel: RiskLevel;
    requiresApproval: boolean;
  }[];
}

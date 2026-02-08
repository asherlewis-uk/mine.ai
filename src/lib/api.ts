import { getSetting } from "./db";

// Type definitions for API responses
interface OllamaModel {
  name: string;
  id?: string;
}

interface OllamaResponse {
  models?: OllamaModel[];
}

interface OpenAIModel {
  id: string;
}

interface OpenAIResponse {
  data?: OpenAIModel[];
}

export interface StreamOptions {
  apiUrl: string;
  modelName: string;
  systemPrompt: string;
  temperature: number;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  onChunk: (chunk: string) => void;
  onThinking?: (thinking: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

/**
 * Stream AI responses from the configured API endpoint
 * Supports OpenAI-compatible streaming APIs (Ollama, LM Studio, etc.)
 */
export async function streamAIResponse(options: StreamOptions): Promise<void> {
  const {
    apiUrl,
    modelName,
    systemPrompt,
    temperature,
    messages,
    onChunk,
    onThinking,
    onComplete,
    onError,
  } = options;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") {
          continue;
        }

        if (trimmed.startsWith("data: ")) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            
            // Handle different API response formats
            const content = 
              json.choices?.[0]?.delta?.content ||
              json.response ||
              json.message?.content ||
              "";

            if (content) {
              onChunk(content);
            }

            // Some models might include thinking/reasoning
            const thinking = json.choices?.[0]?.delta?.thinking || json.thinking;
            if (thinking && onThinking) {
              onThinking(thinking);
            }
          } catch (e) {
            console.warn("Failed to parse streaming chunk:", e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Fetch available models from the API endpoint
 * Supports Ollama (/api/tags) and OpenAI-compatible endpoints
 */
export async function fetchModels(
  baseUrl: string
): Promise<{ success: boolean; models: string[]; error?: string }> {
  try {
    // Try Ollama format first
    const ollamaUrl = baseUrl.replace(/\/v1\/chat\/completions$/, '') + '/api/tags';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(ollamaUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json() as OllamaResponse;
      // Ollama returns { models: [{ name: "...", ... }] }
      const models = data.models?.map((m) => m.name || m.id || "") || [];
      return { success: true, models: models.filter(Boolean) };
    }

    // Fallback to OpenAI format
    const openaiUrl = baseUrl.replace(/\/chat\/completions$/, '') + '/models';
    const openaiResponse = await fetch(openaiUrl);
    
    if (openaiResponse.ok) {
      const data = await openaiResponse.json() as OpenAIResponse;
      const models = data.data?.map((m) => m.id) || [];
      return { success: true, models };
    }

    return {
      success: false,
      models: [],
      error: "Could not fetch models from API",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        models: [],
        error: "Connection timeout",
      };
    }
    return {
      success: false,
      models: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test connection to the API endpoint
 */
export async function testAPIConnection(
  apiUrl: string,
  modelName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 1,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText.slice(0, 200)}`,
      };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Connection timeout. Check your API URL and network.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

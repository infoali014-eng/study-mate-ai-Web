import { buildMrOwlSystemPrompt, SystemPromptParams } from "./prompts";

export interface ChatMessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GenerateAIResponseParams {
  apiKey: string;
  systemPromptParams: SystemPromptParams;
  messages: ChatMessageInput[];
}

export interface GenerateAIResponseResult {
  content: string;
  modelUsed: string;
  tokensUsed?: number;
}

const PREFERRED_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
];

export async function generateMrOwlResponse(
  params: GenerateAIResponseParams
): Promise<GenerateAIResponseResult> {
  const { apiKey, systemPromptParams, messages } = params;

  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "Gemini API key is missing. Please connect your Gemini API key in Settings -> AI Configuration."
    );
  }

  const systemInstructionText = buildMrOwlSystemPrompt(systemPromptParams);

  // Format messages into Gemini API contents structure
  const formattedContents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  let lastError: Error | null = null;

  // Attempt generation with preferred models in order
  for (const modelName of PREFERRED_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

      const payload = {
        system_instruction: {
          parts: [{ text: systemInstructionText }],
        },
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const responseText = candidate?.content?.parts?.[0]?.text;

        if (responseText && responseText.trim()) {
          const tokensUsed = data.usageMetadata?.totalTokenCount || 0;
          return {
            content: responseText.trim(),
            modelUsed: modelName,
            tokensUsed,
          };
        }
      }

      // Handle specific HTTP error status codes
      const errorJson = await response.json().catch(() => ({}));
      const errorMsg = errorJson.error?.message || `HTTP ${response.status} ${response.statusText}`;

      if (response.status === 429) {
        throw new Error("Gemini rate limit exceeded. Please wait a moment and try again.");
      } else if (response.status === 400 || response.status === 403) {
        throw new Error(`Gemini API key error: ${errorMsg}`);
      }

      lastError = new Error(`Model ${modelName} returned error: ${errorMsg}`);
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes("rate limit") || err.message?.includes("API key error")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to generate response from Gemini API.");
}

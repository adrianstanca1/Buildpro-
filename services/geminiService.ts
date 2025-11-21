import { GoogleGenAI, LiveServerMessage, Modality, Content, GenerateContentResponse, Type } from "@google/genai";
import { Message } from "../types";

// Initialize the client with the environment key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatConfig {
  model: string;
  systemInstruction?: string;
  thinkingBudget?: number; // For Thinking Mode
  tools?: any[]; // For Grounding (Search/Maps)
  responseMimeType?: string;
  responseSchema?: any;
}

export const streamChatResponse = async (
  history: Message[],
  newMessage: string,
  imageData?: string,
  mimeType: string = 'image/jpeg',
  onChunk?: (text: string) => void,
  configOverride?: ChatConfig
): Promise<GenerateContentResponse> => {
  
  // Default to 3-Pro for chat unless specified
  const model = configOverride?.model || "gemini-3-pro-preview";
  
  try {
    // Convert internal Message history to API Content format
    const apiHistory: Content[] = history
      .filter(msg => !msg.isThinking && msg.id !== 'intro')
      .map(msg => {
        const parts: any[] = [];
        
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        
        if (msg.image && msg.role === 'user') {
          try {
            // Check if it's a data URL
            const matches = msg.image.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
                const mime = matches[1];
                const data = matches[2];
                parts.push({ 
                  inlineData: { 
                    mimeType: mime, 
                    data: data 
                  } 
                });
            }
          } catch (e) {
            console.warn("Failed to parse history image", e);
          }
        }

        return {
          role: msg.role,
          parts: parts
        };
      });

    // Configure the chat
    const chatConfig: any = {
      systemInstruction: configOverride?.systemInstruction || "You are a helpful, witty, and precise AI assistant for the BuildPro construction platform.",
    };

    // Apply thinking budget if present
    if (configOverride?.thinkingBudget) {
      chatConfig.thinkingConfig = { thinkingBudget: configOverride.thinkingBudget };
    }

    // Apply tools if present (Grounding)
    if (configOverride?.tools) {
      chatConfig.tools = configOverride.tools;
    }

    const chat = ai.chats.create({
      model: model,
      config: chatConfig,
      history: apiHistory
    });

    // Construct the new message
    const parts: any[] = [];
    if (newMessage.trim()) {
        parts.push({ text: newMessage });
    }
    if (imageData) {
        parts.push({ inlineData: { mimeType: mimeType, data: imageData } });
    }
    
    const messageContent = { parts: parts.length > 0 ? parts : [{ text: "Analyze this." }] };

    const result = await chat.sendMessageStream({ message: messageContent });
    
    let finalResponse: GenerateContentResponse | undefined;
    for await (const chunk of result) {
      finalResponse = chunk; // Keep the last chunk for full metadata (grounding etc)
      const text = chunk.text || "";
      if (onChunk) onChunk(text);
    }
    
    return finalResponse!; // Return last chunk which contains grounding metadata

  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

// Updated Image Generation to use Gemini 3 Pro Image Preview
export const generateImage = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      },
    });
    
    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (e) {
    console.warn("Image Gen failed", e);
    throw e;
  }
};

// Veo Video Generation
export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned");

    // Fetch the actual video bytes using the API key
    const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) throw new Error("Failed to download video");
    
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Veo Generation Error:", e);
    throw e;
  }
};

// Audio Transcription
export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: "Transcribe this audio exactly." }
        ]
      }
    });
    return response.text || "";
  } catch (e) {
    console.error("Transcription failed", e);
    throw e;
  }
};

// Text to Speech
export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    
    // Manual Decode Helper
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Simple Int16 PCM decode to Float32 AudioBuffer
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length; 
    const buffer = audioContext.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    
    return buffer;
  } catch (e) {
    console.error("TTS failed", e);
    throw e;
  }
};

export interface GenConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  responseMimeType?: string;
  systemInstruction?: string;
  tools?: any[];
  model?: string;
}

// General prompt runner with model selection and dynamic media support
export const runRawPrompt = async (
  prompt: string, 
  config?: GenConfig,
  mediaData?: string, // Expects raw base64 string
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    const modelName = config?.model || 'gemini-2.5-flash';
    
    const contents: any = {
        role: 'user',
        parts: [{ text: prompt }]
    };

    if (mediaData) {
        contents.parts.push({
            inlineData: {
                mimeType: mimeType,
                data: mediaData
            }
        });
    }

    const result = await ai.models.generateContent({
      model: modelName,
      contents: [contents],
      config: config
    });
    return result.text || "No response text.";
  } catch (e) {
    console.error("Raw prompt error:", e);
    return `Error: ${(e as Error).message}`;
  }
};

export const getLiveClient = () => {
    return ai.live;
};
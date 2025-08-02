import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CodeAssistanceRequest {
  code: string;
  language: string;
  question?: string;
  type: 'debug' | 'optimize' | 'explain' | 'generate' | 'complete';
}

export interface CodeAssistanceResponse {
  suggestion: string;
  improvedCode?: string;
  explanation: string;
}

export async function getCodeAssistance(request: CodeAssistanceRequest): Promise<CodeAssistanceResponse> {
  try {
    let systemPrompt = "";
    let userPrompt = "";

    switch (request.type) {
      case 'debug':
        systemPrompt = "You are an expert debugging assistant. Analyze the code and identify potential bugs, errors, or issues. Provide clear explanations and fixed code.";
        userPrompt = `Debug this ${request.language} code:\n\n${request.code}\n\n${request.question || 'What issues do you see?'}`;
        break;
      case 'optimize':
        systemPrompt = "You are a code optimization expert. Analyze the code and suggest performance improvements, better practices, and cleaner implementations.";
        userPrompt = `Optimize this ${request.language} code:\n\n${request.code}\n\n${request.question || 'How can this be improved?'}`;
        break;
      case 'explain':
        systemPrompt = "You are a coding tutor. Explain code clearly and educationally, breaking down complex concepts for learners.";
        userPrompt = `Explain this ${request.language} code:\n\n${request.code}\n\n${request.question || 'What does this code do?'}`;
        break;
      case 'generate':
        systemPrompt = "You are a code generation assistant. Create clean, efficient, and well-documented code based on requirements.";
        userPrompt = `Generate ${request.language} code for: ${request.question || 'the given requirements'}\n\nContext code:\n${request.code}`;
        break;
      case 'complete':
        systemPrompt = "You are a code completion assistant. Complete the given code snippet logically and efficiently.";
        userPrompt = `Complete this ${request.language} code:\n\n${request.code}\n\n${request.question || 'Continue from where it left off'}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt + " Respond with JSON in this format: { 'suggestion': string, 'improvedCode': string, 'explanation': string }",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestion: { type: "string" },
            improvedCode: { type: "string" },
            explanation: { type: "string" },
          },
          required: ["suggestion", "explanation"],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const result = JSON.parse(rawJson);
      return {
        suggestion: result.suggestion || "No suggestions available",
        improvedCode: result.improvedCode,
        explanation: result.explanation || "No explanation available"
      };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error("Failed to get code assistance: " + (error as Error).message);
  }
}

export async function chatWithAI(messages: AIMessage[]): Promise<string> {
  try {
    const systemInstruction = 'You are an AI coding assistant for GenAI Code platform. Help users with programming questions, provide code examples, debug issues, and offer learning guidance. Be encouraging and educational.';
    
    // Convert messages to a single prompt for Gemini
    const conversationText = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
      },
      contents: conversationText,
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    throw new Error("Failed to chat with AI: " + (error as Error).message);
  }
}

export async function generateCourseThumbnail(courseTitle: string, category: string): Promise<{ url: string }> {
  try {
    const prompt = `Create a modern, professional thumbnail for a coding course titled "${courseTitle}" in the ${category} category. Use a futuristic design with dark background, neon accents, and coding elements. Style should be clean and minimalist.`;

    // Generate image using Gemini's image generation model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content in response");
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // Return base64 data URL for the image
        const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return { url: imageUrl };
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    // Fallback to a placeholder image if generation fails
    console.error("Failed to generate course thumbnail:", error);
    return { url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUEyMDMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM2NkYxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkNvdXJzZTwvdGV4dD4KPC9zdmc+" };
  }
}

export async function generateCourseContent(title: string, level: string, category: string): Promise<{
  description: string;
  duration: string;
}> {
  try {
    const systemInstruction = "You are a curriculum designer for a coding platform. Generate realistic course content. Respond with JSON in this format: { 'description': string, 'duration': string }";
    const prompt = `Create a course description and estimated duration for a ${level} level ${category} course titled "${title}". The description should be engaging and educational, around 150-200 characters. Duration should be realistic (e.g., "8 weeks", "12 weeks").`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            description: { type: "string" },
            duration: { type: "string" },
          },
          required: ["description", "duration"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const result = JSON.parse(rawJson);
      return {
        description: result.description || "A comprehensive coding course designed to enhance your skills.",
        duration: result.duration || "8 weeks"
      };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error("Failed to generate course content: " + (error as Error).message);
  }
}
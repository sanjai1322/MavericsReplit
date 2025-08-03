// Using native fetch (Node.js 18+)

export interface QwenCodeAssistanceRequest {
  type: 'debug' | 'optimize' | 'explain' | 'generate' | 'complete';
  code: string;
  language: string;
  prompt?: string;
  context?: string;
}

export interface QwenMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface QwenResponse {
  content: string;
  success: boolean;
  error?: string;
}

class QwenService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.together.xyz/v1';

  constructor() {
    this.apiKey = process.env.QWEN_API_KEY || null;
  }

  private async makeRequest(messages: QwenMessage[], temperature = 0.7, maxTokens = 2048): Promise<QwenResponse> {
    if (!this.apiKey) {
      return {
        content: "AI service is not configured. Please provide your Qwen API key.",
        success: false,
        error: "No API key provided"
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Qwen API error:', response.status, errorText);
        return {
          content: `AI service error: ${response.status}. Please check your API key and try again.`,
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const data = await response.json() as any;
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          content: data.choices[0].message.content,
          success: true
        };
      } else {
        return {
          content: "Invalid response from AI service",
          success: false,
          error: "Invalid response format"
        };
      }
    } catch (error) {
      console.error('Qwen service error:', error);
      return {
        content: "Failed to connect to AI service. Please try again.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCodeAssistance(request: QwenCodeAssistanceRequest): Promise<QwenResponse> {
    const systemPrompts = {
      debug: "You are an expert code debugger. Analyze the provided code, identify issues, and provide clear solutions with explanations.",
      optimize: "You are a code optimization expert. Analyze the provided code and suggest improvements for better performance, readability, and maintainability.",
      explain: "You are a code educator. Explain the provided code in detail, breaking down its functionality, patterns, and best practices.",
      generate: "You are a code generator. Create high-quality, well-documented code based on the requirements provided.",
      complete: "You are a code completion assistant. Complete the provided code snippet with proper syntax and logic."
    };

    const userPrompt = request.prompt 
      ? `${request.prompt}\n\nCode (${request.language}):\n${request.code}`
      : `Please ${request.type} this ${request.language} code:\n\n${request.code}`;

    const messages: QwenMessage[] = [
      {
        role: 'system',
        content: `${systemPrompts[request.type]} Always provide code examples when relevant and explain your reasoning.${request.context ? ` Additional context: ${request.context}` : ''}`
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    return this.makeRequest(messages);
  }

  async chatWithAI(messages: QwenMessage[]): Promise<QwenResponse> {
    const systemMessage: QwenMessage = {
      role: 'system',
      content: `You are an AI coding assistant for a futuristic programming platform. You help developers learn, debug, and improve their code. 
      
      Key guidelines:
      - Be helpful, accurate, and encouraging
      - Provide practical code examples when relevant
      - Explain complex concepts in simple terms
      - Focus on best practices and modern development approaches
      - Be concise but thorough in your explanations
      - When discussing code, always specify the programming language
      - Help users understand both the "how" and "why" behind solutions`
    };

    const fullMessages = [systemMessage, ...messages];
    return this.makeRequest(fullMessages, 0.8, 1500);
  }

  async generateCourseContent(title: string, level: string, category: string): Promise<{ description: string; duration: string }> {
    const messages: QwenMessage[] = [
      {
        role: 'system',
        content: 'You are an educational content creator. Generate engaging course descriptions and realistic duration estimates for programming courses.'
      },
      {
        role: 'user',
        content: `Create a compelling course description and duration estimate for a ${level}-level ${category} course titled "${title}". 
        
        Requirements:
        - Description should be 2-3 sentences, engaging and informative
        - Duration should be realistic (e.g., "2h 30m", "45m", "3h 15m")
        - Focus on practical skills and outcomes
        - Match the complexity to the specified level`
      }
    ];

    const response = await this.makeRequest(messages, 0.9, 500);
    
    if (!response.success) {
      return {
        description: `Learn ${title.toLowerCase()} with this comprehensive ${level}-level course. Master essential concepts and build practical projects.`,
        duration: level === 'beginner' ? '2h 30m' : level === 'intermediate' ? '3h 45m' : '5h 20m'
      };
    }

    try {
      // Try to parse structured response
      const content = response.content;
      const descriptionMatch = content.match(/Description:\s*(.+?)(?:\n|Duration:|$)/i);
      const durationMatch = content.match(/Duration:\s*(.+?)(?:\n|$)/i);
      
      if (descriptionMatch && durationMatch) {
        return {
          description: descriptionMatch[1].trim(),
          duration: durationMatch[1].trim()
        };
      }
      
      // Fallback: use the full response as description
      return {
        description: content.split('\n')[0] || content.substring(0, 200),
        duration: level === 'beginner' ? '2h 30m' : level === 'intermediate' ? '3h 45m' : '5h 20m'
      };
    } catch (error) {
      return {
        description: `Learn ${title.toLowerCase()} with this comprehensive ${level}-level course. Master essential concepts and build practical projects.`,
        duration: level === 'beginner' ? '2h 30m' : level === 'intermediate' ? '3h 45m' : '5h 20m'
      };
    }
  }

  // Update API key at runtime
  updateApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Check if service is configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const qwenService = new QwenService();

// Export functions for compatibility with existing code
export const getCodeAssistance = (request: QwenCodeAssistanceRequest) => qwenService.getCodeAssistance(request);
export const chatWithAI = (messages: QwenMessage[]) => qwenService.chatWithAI(messages);
export const generateCourseContent = (title: string, level: string, category: string) => qwenService.generateCourseContent(title, level, category);

// For thumbnail generation, we'll return a placeholder since Qwen doesn't generate images
export const generateCourseThumbnail = async (title: string, category: string) => {
  // Return a placeholder thumbnail based on category
  const thumbnails = {
    frontend: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400',
    backend: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    fullstack: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    blockchain: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400'
  };
  
  return { 
    url: thumbnails[category as keyof typeof thumbnails] || thumbnails.frontend 
  };
};

export type CodeAssistanceRequest = QwenCodeAssistanceRequest;
export type AIMessage = QwenMessage;
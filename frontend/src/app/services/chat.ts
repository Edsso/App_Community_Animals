const API_BASE_URL = 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  intent?: string;
  action_performed?: boolean;
  session_id?: string;
  navigate_to?: string;
}

export const chatService = {
  async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao comunicar com o assistente');
    }

    return response.json();
  },

  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/health`);
    return response.json();
  }
};
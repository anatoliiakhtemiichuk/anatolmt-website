// AI Consultation Types

export type SessionStatus = 'unpaid' | 'paid' | 'expired' | 'completed';
export type MessageRole = 'user' | 'assistant' | 'system';

export interface AISession {
  id: string;
  created_at: string;
  updated_at: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  status: SessionStatus;
  expires_at: string;
  messages_used: number;
  max_messages: number;
  client_email: string | null;
  client_ip: string | null;
}

export interface AIMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIConsultRequest {
  sessionId: string;
  message: string;
}

export interface AIConsultResponse {
  success: boolean;
  message?: string;
  error?: string;
  messagesUsed?: number;
  maxMessages?: number;
}

export interface CreateCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

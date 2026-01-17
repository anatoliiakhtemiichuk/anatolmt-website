'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Bot, User, Loader2, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Container, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { AI_INTAKE_QUESTIONS } from '@/lib/ai-system-prompt';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SessionInfo {
  id: string;
  status: string;
  messagesUsed: number;
  maxMessages: number;
  expiresAt: string;
}

export default function AIChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch session and existing messages
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError('Brak ID sesji.');
        setIsFetching(false);
        return;
      }

      try {
        const response = await fetch(`/api/ai-consult?session=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setSessionInfo(data.session);

          // Check session status
          if (data.session.status !== 'paid') {
            setError(
              data.session.status === 'expired'
                ? 'Ta sesja wygasła.'
                : data.session.status === 'completed'
                ? 'Ta sesja została zakończona.'
                : 'Sesja nie jest aktywna.'
            );
            setIsFetching(false);
            return;
          }

          // Load existing messages
          if (data.messages && data.messages.length > 0) {
            setMessages(
              data.messages
                .filter((m: { role: string }) => m.role !== 'system')
                .map((m: { id: string; role: string; content: string; created_at: string }) => ({
                  id: m.id,
                  role: m.role as 'user' | 'assistant',
                  content: m.content,
                  timestamp: new Date(m.created_at),
                }))
            );
          } else {
            // Add initial greeting if no messages
            setMessages([
              {
                id: 'initial',
                role: 'assistant',
                content: AI_INTAKE_QUESTIONS[0],
                timestamp: new Date(),
              },
            ]);
          }
        } else {
          setError(data.error || 'Nie udało się załadować sesji.');
        }
      } catch {
        setError('Błąd połączenia z serwerem.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSessionInfo((prev) =>
          prev
            ? {
                ...prev,
                messagesUsed: data.messagesUsed,
              }
            : null
        );
      } else {
        setError(data.error || 'Wystąpił błąd.');
      }
    } catch {
      setError('Błąd połączenia z serwerem.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Render error state
  if (!sessionId || (error && isFetching === false && messages.length === 0)) {
    return (
      <section className="py-24">
        <Container size="sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-4">
              {error || 'Brak aktywnej sesji'}
            </h1>
            <p className="text-gray-600 mb-6">
              Nie można załadować rozmowy. Sprawdź czy link jest poprawny lub rozpocznij nową konsultację.
            </p>
            <Button variant="primary" onClick={() => router.push('/ai')}>
              Nowa konsultacja
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  // Render loading state
  if (isFetching) {
    return (
      <section className="py-24">
        <Container size="sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#2563EB] mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Ładowanie rozmowy...</p>
          </div>
        </Container>
      </section>
    );
  }

  const isSessionActive = sessionInfo?.status === 'paid';
  const messagesRemaining = sessionInfo
    ? sessionInfo.maxMessages - sessionInfo.messagesUsed
    : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-[#0F172A]">AI Konsultacja</h1>
                <p className="text-xs text-gray-500">
                  {isSessionActive
                    ? `Pozostało wiadomości: ${messagesRemaining}`
                    : 'Sesja nieaktywna'}
                </p>
              </div>
            </div>
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Zarezerwuj wizytę
            </Link>
          </div>
        </Container>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <Container size="md" className="py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-[#0F172A]'
                      : 'bg-[#2563EB]'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-[#0F172A] text-white rounded-tr-sm'
                      : 'bg-white shadow-sm border border-gray-100 rounded-tl-sm'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      'text-xs mt-2',
                      message.role === 'user' ? 'text-gray-400' : 'text-gray-400'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString('pl-PL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                    <span className="text-sm text-gray-500">Piszę...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </Container>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-3">
          <Container>
            <p className="text-red-700 text-sm text-center">{error}</p>
          </Container>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <Container size="md">
          {isSessionActive && messagesRemaining > 0 ? (
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Napisz wiadomość..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={!inputValue.trim() || isLoading}
                className="h-12 w-12 p-0 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">
                {messagesRemaining <= 0
                  ? 'Wykorzystano limit wiadomości.'
                  : 'Sesja nieaktywna.'}
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Zarezerwuj wizytę
              </Link>
            </div>
          )}

          {/* Mobile CTA */}
          <div className="sm:hidden mt-3 text-center">
            <Link
              href="/booking"
              className="text-[#2563EB] text-sm font-medium hover:underline"
            >
              Zarezerwuj wizytę
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}

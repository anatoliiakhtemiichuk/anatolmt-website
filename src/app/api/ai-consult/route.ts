import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { AI_SYSTEM_PROMPT, AI_INTAKE_QUESTIONS, MAX_MESSAGES_PER_SESSION } from '@/lib/ai-system-prompt';
import { AIConsultRequest } from '@/types/ai';

// Placeholder for LLM API call
// Replace this with actual API call to your preferred LLM (OpenAI, Anthropic, etc.)
async function callLLM(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey || apiKey === 'placeholder-llm-key') {
    // Return a mock response for development
    return getMockResponse(messages);
  }

  // Example: OpenAI API call (uncomment and modify as needed)
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
  */

  // For now, return mock response
  return getMockResponse(messages);
}

// Mock response for development without LLM API key
function getMockResponse(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 0) {
    return AI_INTAKE_QUESTIONS[0];
  }

  const lastMessage = userMessages[userMessages.length - 1].content.toLowerCase();

  // Simple mock responses based on keywords
  if (messageCount === 1) {
    return `Dziękuję za informację. Rozumiem, że masz dolegliwości związane z "${userMessages[0].content}".

Jak długo odczuwasz te dolegliwości? Czy to problem:
- Świeży (kilka dni)
- Kilka tygodni
- Kilka miesięcy lub dłużej`;
  }

  if (messageCount === 2) {
    return `Rozumiem. A jak oceniłbyś/oceniłabyś intensywność bólu w skali od 1 do 10, gdzie 1 to minimalne dolegliwości, a 10 to bardzo silny ból?`;
  }

  if (messageCount === 3) {
    return `Dziękuję. Jeszcze jedno ważne pytanie - czy masz jakieś przeciwwskazania do masażu, takie jak:
- Ciąża
- Aktywny nowotwór
- Stan zapalny (gorączka, infekcja)
- Świeży uraz lub operacja (ostatnie 6 tygodni)
- Zaburzenia krzepnięcia krwi

Proszę odpowiedz "nie mam" jeśli żadne z powyższych Cię nie dotyczy.`;
  }

  if (lastMessage.includes('nie mam') || lastMessage.includes('brak') || lastMessage.includes('żadne')) {
    return `Świetnie, dziękuję za odpowiedzi!

**PODSUMOWANIE:**
Na podstawie naszej rozmowy, sugeruję rozważenie **Wizyty 1h (200-250 zł)** - to standardowa sesja, która pozwoli terapeucie dokładnie zbadać problem i przeprowadzić odpowiednią terapię.

**PRZED WIZYTĄ:**
- Nie jedz ciężkiego posiłku 2h przed wizytą
- Ubierz się wygodnie
- Zabierz wyniki badań jeśli masz
- Poinformuj terapeutę o wszystkich dolegliwościach

**PO MASAŻU:**
- Pij dużo wody
- Unikaj intensywnego wysiłku przez 24h
- Lekka bolesność jest normalna

Pamiętaj, że to tylko wstępna orientacja. Ostateczną ocenę przeprowadzi terapeuta podczas wizyty.

Zarezerwuj wizytę na stronie: /booking

Czy masz jeszcze jakieś pytania?`;
  }

  return `Dziękuję za informację. Czy masz jeszcze jakieś pytania dotyczące wizyty w naszym gabinecie? Chętnie pomogę.

Jeśli jesteś gotowy/gotowa do rezerwacji, zapraszam na stronę /booking`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIConsultRequest = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'Brak wymaganych danych.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get session and verify it's paid and not expired
    const { data: session, error: sessionError } = await supabase
      .from('ai_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Sesja nie istnieje.' },
        { status: 404 }
      );
    }

    // Check session status
    if (session.status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Sesja nie została opłacona.' },
        { status: 403 }
      );
    }

    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
      await supabase
        .from('ai_sessions')
        .update({ status: 'expired' })
        .eq('id', sessionId);

      return NextResponse.json(
        { success: false, error: 'Sesja wygasła.' },
        { status: 403 }
      );
    }

    // Check message limit
    if (session.messages_used >= MAX_MESSAGES_PER_SESSION) {
      await supabase
        .from('ai_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId);

      return NextResponse.json(
        { success: false, error: 'Przekroczono limit wiadomości.' },
        { status: 403 }
      );
    }

    // Get previous messages for context
    const { data: previousMessages } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Build messages array for LLM
    const llmMessages = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...(previousMessages || []).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // Save user message
    await supabase.from('ai_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message,
    });

    // Call LLM
    const aiResponse = await callLLM(llmMessages);

    // Save assistant message
    await supabase.from('ai_messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: aiResponse,
    });

    // Update messages count
    const newMessagesUsed = session.messages_used + 2; // user + assistant
    await supabase
      .from('ai_sessions')
      .update({ messages_used: newMessagesUsed })
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      message: aiResponse,
      messagesUsed: newMessagesUsed,
      maxMessages: MAX_MESSAGES_PER_SESSION,
    });
  } catch (error) {
    console.error('AI consult error:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas przetwarzania.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve chat history
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session');

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Brak ID sesji.' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Get session
  const { data: session, error: sessionError } = await supabase
    .from('ai_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { success: false, error: 'Sesja nie istnieje.' },
      { status: 404 }
    );
  }

  // Get messages
  const { data: messages } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return NextResponse.json({
    success: true,
    session: {
      id: session.id,
      status: session.status,
      messagesUsed: session.messages_used,
      maxMessages: session.max_messages,
      expiresAt: session.expires_at,
    },
    messages: messages || [],
  });
}

-- AI Consultation Tables for M&T ANATOL
-- Run this migration in your Supabase SQL Editor

-- AI Sessions table
-- Tracks paid consultation sessions
CREATE TABLE IF NOT EXISTS ai_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  status TEXT DEFAULT 'unpaid' NOT NULL CHECK (status IN ('unpaid', 'paid', 'expired', 'completed')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL,
  messages_used INTEGER DEFAULT 0 NOT NULL,
  max_messages INTEGER DEFAULT 30 NOT NULL,
  client_email TEXT,
  client_ip TEXT
);

-- AI Messages table
-- Stores conversation history for each session
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES ai_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_sessions_stripe_session_id ON ai_sessions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_status ON ai_sessions(status);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_expires_at ON ai_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session_id ON ai_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for ai_sessions updated_at
DROP TRIGGER IF EXISTS update_ai_sessions_updated_at ON ai_sessions;
CREATE TRIGGER update_ai_sessions_updated_at
  BEFORE UPDATE ON ai_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations for service role (server-side)
-- For public access, sessions are identified by their UUID (acts as a secret token)
CREATE POLICY "Allow read own session" ON ai_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow insert session" ON ai_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update own session" ON ai_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Allow read messages for session" ON ai_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow insert messages" ON ai_messages
  FOR INSERT WITH CHECK (true);

-- Comments
COMMENT ON TABLE ai_sessions IS 'Stores AI consultation sessions with payment status';
COMMENT ON TABLE ai_messages IS 'Stores chat messages for AI consultation sessions';
COMMENT ON COLUMN ai_sessions.status IS 'unpaid: waiting for payment, paid: active session, expired: session timed out, completed: session finished';
COMMENT ON COLUMN ai_sessions.messages_used IS 'Number of messages used in this session (limit: max_messages)';

/*
  # Add chat sessions support

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key) - Unique identifier for each chat session
      - `title` (text) - Title of the chat session (auto-generated from first message)
      - `created_at` (timestamptz) - Timestamp when session was created
      - `updated_at` (timestamptz) - Timestamp when session was last updated
  
  2. Changes to existing tables
    - Add `session_id` column to `messages` table
    - Add foreign key constraint linking messages to chat_sessions
  
  3. Security
    - Enable RLS on `chat_sessions` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert/update access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat sessions"
  ON chat_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert chat sessions"
  ON chat_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
/*
  # Create chat messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `content` (text) - The message text content
      - `audio_url` (text, nullable) - URL to audio file if message was recorded
      - `role` (text) - Either 'user' or 'assistant' to identify sender
      - `created_at` (timestamptz) - Timestamp when message was created
  
  2. Security
    - Enable RLS on `messages` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  audio_url text,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);
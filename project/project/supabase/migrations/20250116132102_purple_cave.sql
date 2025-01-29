/*
  # Create admin table and policies

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `admins` table
    - Add policies for admin authentication
*/

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies for admin table
CREATE POLICY "Enable read access for authenticated admins only"
    ON admins FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins a
            WHERE a.auth_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for signup"
    ON admins FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = auth_id);

-- Trigger for updated_at
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
/*
  # Add Pre-visit Reports Table

  1. New Tables
    - `previsit_reports`
      - `id` (uuid, primary key)
      - `interaction_id` (uuid, references interactions)
      - `msl_id` (uuid, references users)
      - `customer_id` (uuid, references customers)
      - `previous_interactions_summary` (text)
      - `profile_changes_summary` (text)
      - `suggested_topics` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `previsit_reports` table
    - Add policies for authenticated users
*/

-- Create previsit_reports table
CREATE TABLE previsit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_id UUID REFERENCES interactions(id) ON DELETE CASCADE,
    msl_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    previous_interactions_summary TEXT,
    profile_changes_summary TEXT,
    suggested_topics TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE previsit_reports ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_previsit_reports_updated_at
    BEFORE UPDATE ON previsit_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Enable read for authenticated users"
    ON previsit_reports FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON previsit_reports FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for report creator"
    ON previsit_reports FOR UPDATE
    TO authenticated
    USING (auth.uid() = msl_id)
    WITH CHECK (auth.uid() = msl_id);

CREATE POLICY "Enable delete for report creator"
    ON previsit_reports FOR DELETE
    TO authenticated
    USING (auth.uid() = msl_id);
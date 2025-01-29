/*
  # Add tasks table and policies

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `task_created_by` (uuid, references users)
      - `task_requested_by` (text)
      - `task_assigned_to` (uuid, references users)
      - `customer_id` (uuid, references customers)
      - `task_description` (text)
      - `due_date` (date)
      - `interaction_id` (uuid, references interactions, nullable)
      - `status` (text, check constraint)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    task_requested_by TEXT NOT NULL,
    task_assigned_to UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    due_date DATE NOT NULL,
    interaction_id UUID REFERENCES interactions(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Enable read for authenticated users"
    ON tasks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON tasks FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for task creator or assignee"
    ON tasks FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = task_created_by OR 
        auth.uid() = task_assigned_to
    )
    WITH CHECK (
        auth.uid() = task_created_by OR 
        auth.uid() = task_assigned_to
    );

CREATE POLICY "Enable delete for task creator"
    ON tasks FOR DELETE
    TO authenticated
    USING (auth.uid() = task_created_by);
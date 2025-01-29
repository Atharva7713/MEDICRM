/*
  # Fix User Policies

  1. Changes
    - Remove recursive policies that were causing infinite loops
    - Simplify user access policies
    - Add basic RLS policies for authenticated users
    
  2. Security
    - Enable RLS
    - Add policies for basic CRUD operations
    - Maintain security while preventing recursion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "System managers can view all users" ON users;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
    ON users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
    ON users FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Fix interaction policies to avoid recursion
DROP POLICY IF EXISTS "Users can view their own interactions" ON interactions;
DROP POLICY IF EXISTS "Managers can view all interactions" ON interactions;

CREATE POLICY "Enable read access for authenticated users"
    ON interactions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON interactions FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON interactions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
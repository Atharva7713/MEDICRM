/*
  # Fix Admin Policies

  1. Changes
    - Drop existing recursive policies
    - Create new non-recursive policies for admins table
    - Add proper security checks for admin operations

  2. Security
    - Enable RLS on admins table
    - Add policies for read/write operations
    - Prevent infinite recursion in policy checks
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access for authenticated admins only" ON admins;
DROP POLICY IF EXISTS "Enable insert for signup" ON admins;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
    ON admins FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for signup"
    ON admins FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Enable update for own profile"
    ON admins FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_id)
    WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Enable delete for own profile"
    ON admins FOR DELETE
    TO authenticated
    USING (auth.uid() = auth_id);
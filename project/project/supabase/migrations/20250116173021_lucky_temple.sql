/*
  # Fix Customer Table Policies

  1. Changes
    - Drop all existing customer policies to start fresh
    - Add comprehensive policies for both admin access and general read access
  
  2. Security
    - Authenticated users can read customer data
    - Admins have full CRUD access
    - Policies are simplified and non-recursive
*/

-- First, drop all existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "admin_full_access" ON customers;
    DROP POLICY IF EXISTS "allow_customer_read_for_interactions" ON customers;
    DROP POLICY IF EXISTS "Enable full access for authenticated admins" ON customers;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Create a policy for reading customers (needed for interactions)
CREATE POLICY "allow_read_customers"
    ON customers
    FOR SELECT
    TO authenticated
    USING (true);

-- Create separate policies for admin operations
CREATE POLICY "allow_admin_insert"
    ON customers
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "allow_admin_update"
    ON customers
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "allow_admin_delete"
    ON customers
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    );
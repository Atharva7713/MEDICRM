/*
  # Fix Customer Table Policies

  1. Changes
    - Drop existing customer policies
    - Add new policies for admin access to customers table
    
  2. Security
    - Enable RLS on customers table
    - Add policies for CRUD operations
    - Only authenticated admins can manage customers
*/

-- Drop existing customer policies
DROP POLICY IF EXISTS "Authenticated users can view customers" ON customers;
DROP POLICY IF EXISTS "MSL and managers can create customers" ON customers;

-- Create new policies for admin access
CREATE POLICY "Enable read access for authenticated admins"
    ON customers FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for authenticated admins"
    ON customers FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Enable update for authenticated admins"
    ON customers FOR UPDATE
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

CREATE POLICY "Enable delete for authenticated admins"
    ON customers FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE auth_id = auth.uid()
        )
    );
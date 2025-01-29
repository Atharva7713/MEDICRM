/*
  # Add Customer Read Policy for Interactions

  1. Changes
    - Add policy to allow reading customers when creating interactions
    - Maintain existing admin policies
  
  2. Security
    - Authenticated users can read customer data
    - Maintains existing admin full access
*/

-- Add policy for reading customers when creating interactions
CREATE POLICY "allow_customer_read_for_interactions"
    ON customers
    FOR SELECT
    TO authenticated
    USING (true);
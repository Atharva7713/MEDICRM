/*
  # CRM Initial Schema Setup

  1. New Tables
    - `customers` (KOL accounts)
      - `id` (uuid, primary key)
      - `name` (text)
      - `picture_url` (text)
      - `specialty` (text)
      - `affiliation` (text)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `publications`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `title` (text)
      - `link` (text)
      - `publication_date` (date)
      - `created_at` (timestamp)
    
    - `resources`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `type` (text) -- 'study' or 'publication'
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `users` (application users)
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `role` (text)
      - `phone` (text)
      - `region` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_customer_associations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `customer_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `interactions`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `interaction_date` (timestamp)
      - `interaction_type` (text)
      - `discussion_topics` (text)
      - `follow_up_description` (text)
      - `follow_up_due_date` (date)
      - `compliance_approved` (boolean)
      - `compliance_flag` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `interaction_attachments`
      - `id` (uuid, primary key)
      - `interaction_id` (uuid, foreign key)
      - `file_url` (text)
      - `file_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users based on their roles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers (KOLs) table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    specialty TEXT,
    affiliation TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publications table
CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    link TEXT,
    publication_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('study', 'publication')),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('MSL', 'MSL Manager', 'System Manager', 'Compliance Manager', 'Database Manager')),
    phone TEXT,
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- CREATE TABLE users (
--     id UUID PRIMARY KEY REFERENCES auth.users(id),
--     global_ds_id TEXT UNIQUE NOT NULL, -- Global DS Unique ID
--     name TEXT NOT NULL,
--     email TEXT NOT NULL UNIQUE,
--     role TEXT NOT NULL CHECK (role IN ('MSL', 'MSL Manager', 'System Manager', 'Compliance Manager', 'Database Manager', 'Institute Member', 'Other')),
--     phone TEXT,
--     region TEXT,
--     basic_contact_details JSONB, -- JSONB to store additional contact details flexibly
--     training_records JSONB, -- Stores training data like CV or certifications
--     group TEXT CHECK (group IN ('Group 1', 'Group 2', 'Group 3')),
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- User-Customer associations table
CREATE TABLE user_customer_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, customer_id)
);

-- Interactions table
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interaction_date TIMESTAMPTZ NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('In-person', 'Virtual', 'Email')),
    discussion_topics TEXT,
    follow_up_description TEXT,
    follow_up_due_date DATE,
    compliance_approved BOOLEAN DEFAULT false,
    compliance_flag BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interaction attachments table
CREATE TABLE interaction_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interaction_id UUID REFERENCES interactions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_customer_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "System managers can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'System Manager'
        )
    );

-- Customers policies
CREATE POLICY "Authenticated users can view customers"
    ON customers FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "MSL and managers can create customers"
    ON customers FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('MSL', 'MSL Manager', 'System Manager')
        )
    );

-- Interactions policies
CREATE POLICY "Users can view their own interactions"
    ON interactions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Managers can view all interactions"
    ON interactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('MSL Manager', 'System Manager', 'Compliance Manager')
        )
    );

CREATE POLICY "Users can create interactions"
    ON interactions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactions_updated_at
    BEFORE UPDATE ON interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
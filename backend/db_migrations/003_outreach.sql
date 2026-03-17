-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'running', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM ('pending', 'generated', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create outreach_campaigns table
CREATE TABLE IF NOT EXISTS outreach_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status campaign_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outreach_contacts table
CREATE TABLE IF NOT EXISTS outreach_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES outreach_campaigns(id) ON DELETE CASCADE,
    hr_name TEXT,
    company TEXT,
    role TEXT,
    email TEXT,
    linkedin_url TEXT,
    notes TEXT,
    status contact_status DEFAULT 'pending',
    subject TEXT,
    body TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_contacts ENABLE ROW LEVEL SECURITY;

-- Policies for outreach_campaigns
DO $$ BEGIN
    CREATE POLICY "Users can view their own outreach campaigns" ON outreach_campaigns
        FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own outreach campaigns" ON outreach_campaigns
        FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own outreach campaigns" ON outreach_campaigns
        FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete their own outreach campaigns" ON outreach_campaigns
        FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Policies for outreach_contacts
DO $$ BEGIN
    CREATE POLICY "Users can view contacts of their campaigns" ON outreach_contacts
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM outreach_campaigns
                WHERE outreach_campaigns.id = outreach_contacts.campaign_id
                AND outreach_campaigns.user_id = auth.uid()
            )
        );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert contacts to their campaigns" ON outreach_contacts
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM outreach_campaigns
                WHERE outreach_campaigns.id = outreach_contacts.campaign_id
                AND outreach_campaigns.user_id = auth.uid()
            )
        );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update contacts of their campaigns" ON outreach_contacts
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM outreach_campaigns
                WHERE outreach_campaigns.id = outreach_contacts.campaign_id
                AND outreach_campaigns.user_id = auth.uid()
            )
        );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete contacts of their campaigns" ON outreach_contacts
        FOR DELETE USING (
            EXISTS (
                SELECT 1 FROM outreach_campaigns
                WHERE outreach_campaigns.id = outreach_contacts.campaign_id
                AND outreach_campaigns.user_id = auth.uid()
            )
        );
EXCEPTION WHEN duplicate_object THEN null; END $$;

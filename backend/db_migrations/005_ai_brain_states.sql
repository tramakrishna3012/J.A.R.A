-- Migration: 005_ai_brain_states.sql
-- Description: Creates the core jobs and applications tables (if missing) and updates them to support new autonomous agentic states.

-- 1. Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    company text NOT NULL,
    platform text,
    job_link text,
    status text DEFAULT 'Saved',
    hr_email text,
    raw_text text,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Add AI Agent Tracking Columns to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS agent_status text DEFAULT 'pending_analysis',
ADD COLUMN IF NOT EXISTS execution_plan jsonb DEFAULT '[]'::jsonb;

-- 3. Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    status_update text NOT NULL,
    timestamp timestamp with time zone DEFAULT now()
);

-- 4. Add AI Agent Tracking Columns to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS n8n_webhook_id text,
ADD COLUMN IF NOT EXISTS requires_human_approval boolean DEFAULT false;

-- 5. Create an AI Activity Log table for the Decision Engine's short-term memory
CREATE TABLE IF NOT EXISTS public.ai_activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    agent_name text NOT NULL, -- e.g., 'planner', 'resume_optimizer', 'referral'
    action_taken text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 6. Enable Row Level Security (RLS) for all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_activity_logs ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies for jobs
DO $$ BEGIN
    CREATE POLICY "Users can manage their own jobs" ON public.jobs
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 8. Define RLS Policies for applications
DO $$ BEGIN
    CREATE POLICY "Users can manage their own job applications" ON public.applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE jobs.id = applications.job_id
            AND jobs.user_id = auth.uid()
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 9. Define RLS Policies for ai_activity_logs
DO $$ BEGIN
    CREATE POLICY "Users can view their own AI activities" ON public.ai_activity_logs
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Note: Execute these via the Supabase SQL Editor.

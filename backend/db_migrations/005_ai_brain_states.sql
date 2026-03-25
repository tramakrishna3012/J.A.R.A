-- Migration: 005_ai_brain_states.sql
-- Description: Updates the jobs and applications tables to support the new autonomous agentic states.

-- 1. Add agent_status column to jobs table to track the high-level position of the AI Brain
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS agent_status text DEFAULT 'pending_analysis';

-- 2. Add an execution_plan JSONB column to jobs to store the planner's state machine output
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS execution_plan jsonb DEFAULT '[]'::jsonb;

-- 3. Update the Applications table to track specific webhook action steps from n8n
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS n8n_webhook_id text,
ADD COLUMN IF NOT EXISTS requires_human_approval boolean DEFAULT false;

-- 4. Create an AI Activity Log table for the Decision Engine's short-term memory
CREATE TABLE IF NOT EXISTS public.ai_activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    agent_name text NOT NULL, -- e.g., 'planner', 'resume_optimizer', 'referral'
    action_taken text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Note: Execute these via the Supabase SQL Editor.

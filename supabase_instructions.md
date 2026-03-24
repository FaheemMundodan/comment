# Supabase Setup Guide

Your codebase has been completely migrated to use Supabase instead of SQLite! I have updated all the API routes and data models to use the `@supabase/supabase-js` client properly.

### 1. Run the Database Schema
To finalize the backend, you need to create the required tables in your Supabase project.

Please log in to your Supabase dashboard, open the **SQL Editor**, and paste & run the following exact commands:

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  assigned_comment_id uuid
);

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  assigned_user_id uuid
);

CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO public.settings (key, value) VALUES ('latest_reel_link', '');
INSERT INTO public.settings (key, value) VALUES ('latest_fb_link', '');
```

### 2. Verify Your Environment Variables
Double check that your `.env` or `.env.local` contains the variables exactly like this (which it likely already does since you added them!):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

Once the tables are created, the app will be fully powered by Supabase and completely ready for action! If you experience any weird errors, restart your local auto-running Next.js dev server.

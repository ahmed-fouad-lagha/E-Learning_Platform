# Supabase Setup Instructions

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for the project to be ready

## 2. Get Your Credentials
1. Go to Settings > API
2. Copy your Project URL
3. Copy your anon/public key

## 3. Update Environment Variables
Replace the values in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-actual-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 4. Create Database Schema
Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  avatar_url text,
  phone text,
  role text not null default 'STUDENT',
  grade text,
  wilaya text,
  school text,
  parent_phone text,
  date_of_birth date,
  subjects text,
  experience integer,
  qualification text,
  is_verified boolean default false,
  is_active boolean default true,
  last_login timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;

-- Create policies
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', 'User'));
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 5. Test Authentication
1. Restart your development server
2. Try registering a new account
3. Check your Supabase dashboard to see the new user

## 6. Optional: Email Configuration
To enable email verification:
1. Go to Authentication > Settings
2. Configure your email provider
3. Enable email confirmations

import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:hOp9GkWm2vYIddSi@db.meqkbfznnmktztfibkaz.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function runMigration() {
    await client.connect();
    console.log('Connected to Supabase DB...');

    const schema = `
    -- Enable UUID extension
    create extension if not exists "uuid-ossp";

    -- 1. Profiles (Public User Data)
    create table if not exists public.profiles (
      id uuid references auth.users on delete cascade not null primary key,
      username text unique,
      avatar_url text,
      website text,
      updated_at timestamp with time zone,
      constraint username_length check (char_length(username) >= 3)
    );
    alter table public.profiles enable row level security;
    
    create policy "Public profiles are viewable by everyone." on public.profiles
      for select using (true);

    create policy "Users can insert their own profile." on public.profiles
      for insert with check (auth.uid() = id);

    create policy "Users can update own profile." on public.profiles
      for update using (auth.uid() = id);

    -- 2. Activity Log (Private)
    create table if not exists public.activity_log (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users not null,
      type text check (type in ('commit', 'task', 'note', 'milestone')),
      source text,
      title text not null,
      description text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    alter table public.activity_log enable row level security;

    create policy "Users can manipulate own activity." on public.activity_log
      for all using (auth.uid() = user_id);

    -- 3. Ideas (Parking Lot - Private)
    create table if not exists public.ideas (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users not null,
      title text not null,
      description text,
      tags text[], 
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    alter table public.ideas enable row level security;

    create policy "Users can manipulate own ideas." on public.ideas
      for all using (auth.uid() = user_id);

    -- 4. Drafts (Content - Private)
    create table if not exists public.drafts (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users not null,
      title text not null,
      type text,
      platform text,
      status text check (status in ('Ready', 'Draft', 'Scripted')),
      content text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    alter table public.drafts enable row level security;

    create policy "Users can manipulate own drafts." on public.drafts
      for all using (auth.uid() = user_id);
    
    -- Function to handle new user signup automatically
    create or replace function public.handle_new_user() 
    returns trigger as $$
    begin
      insert into public.profiles (id, username, avatar_url)
      values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
      return new;
    end;
    $$ language plpgsql security definer;

    -- Trigger for new users
    -- drop trigger if exists on_auth_user_created on auth.users;
    -- create trigger on_auth_user_created
    --   after insert on auth.users
    --   for each row execute procedure public.handle_new_user();
  `;

    try {
        await client.query(schema);
        console.log('Schema created successfully!');
    } catch (err) {
        console.error('Error creating schema:', err);
    } finally {
        await client.end();
    }
}

runMigration();

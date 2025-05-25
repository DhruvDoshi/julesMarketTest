# FinPort Supabase Backend Setup

This application is designed to work with Supabase for its backend (Auth, Database, Storage).

## Initial Supabase Project Setup:

1.  Go to [Supabase.io](https://supabase.io/) and create a new project.
2.  Save your Project URL and `anon` key. These will be needed as environment variables for the frontend application (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3.  Under "Authentication" -> "Providers", enable Email/Password and optionally other providers like Google, GitHub etc.
4.  Under "Authentication" -> "Settings", you might want to disable "Enable email confirmations" for easier local development initially.

## Database Schema:

Use the SQL Editor in your Supabase project dashboard to run the following SQL commands to create the necessary tables and relationships.

The `stocks` table is a general reference for stock information. `holdings`, `transactions`, and `watchlist` link to specific users and their portfolios.

---

### Users (Handled by Supabase Auth + Profiles)

Supabase automatically creates an `auth.users` table. You'll typically create a public `profiles` table that has a one-to-one relationship with `auth.users` to store public user data.

```sql
-- Create a table for public user profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  email text, -- Added to store email from auth.users
  -- Add other profile fields here

  constraint full_name_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See Supabase docs for how to configure RLS for profiles.
-- Example: Allow users to read all profiles, but only update their own.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) 
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---
### Stocks

```sql
create table stocks (
  id bigserial primary key,
  symbol text not null unique,
  name text not null,
  sector text,
  industry text,
  exchange text,
  country text,
  logo_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Index for faster symbol lookups
create index idx_stocks_symbol on stocks(symbol);
```
*(Note: You might populate this table from an API or a seed script. Current price, market cap, P/E are volatile and often fetched live or from a specialized service rather than stored directly if updates are frequent).*

---
### Portfolios

```sql
create table portfolios (
  id bigserial primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade
);

alter table portfolios enable row level security;
create policy "Users can manage their own portfolios."
  on portfolios for all using (auth.uid() = user_id);
```

---
### Holdings

```sql
create table holdings (
  id bigserial primary key,
  portfolio_id bigint references portfolios not null,
  stock_id bigint references stocks not null,
  -- Alternatively, if not using a separate stocks table or for simplicity:
  -- stock_symbol text not null,
  quantity numeric(18, 4) not null check (quantity > 0), -- Allows for fractional shares
  average_buy_price numeric(18, 4) not null check (average_buy_price >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint fk_portfolio foreign key (portfolio_id) references portfolios(id) on delete cascade,
  constraint fk_stock foreign key (stock_id) references stocks(id) on delete restrict, -- Or ON DELETE SET NULL / CASCADE depending on desired behavior
  unique(portfolio_id, stock_id) -- A user should only have one holding entry per stock in a portfolio
);

alter table holdings enable row level security;
create policy "Users can manage holdings in their own portfolios."
  on holdings for all using (exists (
    select 1 from portfolios p where p.id = portfolio_id and p.user_id = auth.uid()
  ));
```
*(Note: `cost_basis`, `current_value`, `profit_loss` are typically calculated fields, not stored directly unless for snapshotting.)*

---
### Transactions

```sql
create type transaction_type as enum ('buy', 'sell', 'dividend', 'split');

create table transactions (
  id bigserial primary key,
  portfolio_id bigint references portfolios not null,
  stock_id bigint references stocks not null,
  -- stock_symbol text not null, -- Can be denormalized
  type transaction_type not null,
  quantity numeric(18, 4) not null check (quantity > 0),
  price_per_unit numeric(18, 4) not null check (price_per_unit >= 0),
  transaction_date timestamp with time zone not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint fk_portfolio foreign key (portfolio_id) references portfolios(id) on delete cascade,
  constraint fk_stock foreign key (stock_id) references stocks(id) on delete restrict
);

alter table transactions enable row level security;
create policy "Users can manage transactions in their own portfolios."
  on transactions for all using (exists (
    select 1 from portfolios p where p.id = portfolio_id and p.user_id = auth.uid()
  ));
```

---
### Watchlist

```sql
create table watchlist (
  id bigserial primary key,
  user_id uuid references auth.users not null,
  stock_id bigint references stocks not null,
  -- stock_symbol text not null, -- Can be denormalized
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  alert_price_above numeric(18,4),
  alert_price_below numeric(18,4),
  constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade,
  constraint fk_stock foreign key (stock_id) references stocks(id) on delete cascade, -- Cascade delete if stock is removed from system
  unique(user_id, stock_id) -- User can only have a stock once in their watchlist
);

alter table watchlist enable row level security;
create policy "Users can manage their own watchlist."
  on watchlist for all using (auth.uid() = user_id);
```

---
## Storage (for profile pictures, etc.)

You can create a Supabase Storage bucket (e.g., named `avatars`) for user profile pictures. Set appropriate access policies (e.g., public read for avatars, authenticated write for users to their own avatar).

---

This provides a basic schema. You may need to add more specific columns, indexes, or RLS policies based on detailed application requirements.
```

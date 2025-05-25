// src/types/supabase.ts

export interface UserProfile {
  id: string; // Typically UUID, corresponds to auth.users.id
  email?: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
  // Any other profile-specific fields
}

export interface Stock {
  id: number; // Or string if using a symbol as primary key, though number is common for DB IDs
  symbol: string; // e.g., AAPL
  name: string; // e.g., Apple Inc.
  sector?: string;
  industry?: string;
  exchange?: string; // e.g., NASDAQ
  country?: string;
  // current_price: number; // This might be better fetched live or stored in a separate table for price history
  // market_cap?: number;
  // pe_ratio?: number;
  // description?: string;
  // logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  id: number; // Or UUID string
  user_id: string; // Foreign key to users.id
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  DIVIDEND = 'dividend',
  // SPLIT = 'split' // etc.
}

export interface Holding {
  id: number; // Or UUID string
  portfolio_id: number; // Foreign key to portfolios.id
  stock_id: number; // Foreign key to stocks.id (or stock_symbol if not using a separate stocks table like this)
  // stock_symbol: string; // Denormalized for easier access, or use a join
  quantity: number;
  average_buy_price: number;
  // cost_basis: number; // Calculated: quantity * average_buy_price
  // current_value?: number; // Calculated: quantity * current_stock_price (fetched live)
  // profit_loss?: number; // Calculated
  // profit_loss_percentage?: number; // Calculated
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: number; // Or UUID string
  portfolio_id: number; // Foreign key to portfolios.id
  // holding_id?: number; // Optional: Foreign key to holdings.id if transactions directly affect a specific holding lot
  stock_id: number; // Foreign key to stocks.id (or stock_symbol)
  // stock_symbol: string; // Denormalized for easier access
  type: TransactionType; // 'buy', 'sell', 'dividend'
  quantity: number;
  price_per_unit: number; // Price at which the transaction occurred
  transaction_date: string; // ISO date string
  notes?: string;
  created_at?: string;
}

export interface WatchlistItem {
  id: number; // Or UUID string
  user_id: string; // Foreign key to users.id
  stock_id: number; // Foreign key to stocks.id (or stock_symbol)
  // stock_symbol: string; // Denormalized for easier access
  notes?: string;
  created_at?: string;
  // alert_price_above?: number;
  // alert_price_below?: number;
}

// It's also good to have a type for the public user data if different from UserProfile
export interface PublicUser {
    id: string;
    full_name?: string;
    avatar_url?: string;
}

// src/types/api.ts

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string; // e.g., "Common Stock", "ETF"
}

export interface StockDetails {
  symbol: string;
  name: string;
  current_price: number;
  change_today: number;
  change_today_percent: number;
  previous_close?: number;
  open?: number;
  day_high?: number;
  day_low?: number;
  volume?: number;
  market_cap?: number;
  pe_ratio?: number | null;
  eps?: number;
  dividend_yield?: number | null;
  sector?: string;
  industry?: string;
  description?: string;
  website?: string;
  logo_url?: string;
  // Potentially add more fields like 52_week_high/low etc.
}

export interface StockCandle {
  date: number; // Unix timestamp (seconds or ms)
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface NewsArticle {
  id: string;
  source: string; // e.g., "Yahoo Finance"
  headline: string;
  summary?: string;
  url: string;
  image_url?: string;
  published_at: string; // ISO date string
  symbols_mentioned?: string[];
}

// Portfolio types can reuse or extend types from supabase.ts if they match,
// or be specific to API responses if the shape is different.
// For now, let's assume it's similar to PortfolioCardData for the list
// and more detailed for a single portfolio.

// Re-using from supabase.ts for consistency if possible, or redefine if API shape differs
import { Holding, Transaction, Portfolio } from './supabase'; 

export interface PortfolioDetail extends Portfolio {
    holdings: Holding[]; // These might need to be enriched with current stock price data
    transactions: Transaction[];
    // Calculated values
    total_value: number;
    total_profit_loss: number;
    total_profit_loss_percentage: number;
    // performance_history: { date: string, value: number }[]; // For charts
}

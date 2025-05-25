// src/services/api.ts
import { StockSearchResult, StockDetails, StockCandle, NewsArticle, PortfolioDetail } from '@/types/api';
import { PortfolioCardData } from '@/components/PortfolioCard'; // For fetchUserPortfolios list
import { mockStocks as mockStockSearchData } from '@/components/StockSearchBar'; // Reuse existing mock

const SIMULATED_DELAY = 800; // ms

// --- Stock Search & Details ---
export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
  console.log(`API: Searching stocks for "${query}"`);
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = mockStockSearchData
        .filter(stock => 
          stock.symbol.toLowerCase().includes(lowerQuery) || 
          stock.name.toLowerCase().includes(lowerQuery)
        )
        .map(stock => ({ ...stock, exchange: 'NASDAQ', type: 'Common Stock' })); // Add some extra fields
      resolve(results);
    }, SIMULATED_DELAY);
  });
};

export const fetchStockDetails = async (symbol: string): Promise<StockDetails | null> => {
  console.log(`API: Fetching details for stock "${symbol}"`);
  return new Promise(resolve => {
    setTimeout(() => {
      const stock = mockStockSearchData.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
      if (stock) {
        resolve({
          symbol: stock.symbol,
          name: stock.name,
          current_price: Math.random() * 500 + 50, // Random price
          change_today: (Math.random() * 10 - 5), // Random change
          change_today_percent: (Math.random() * 5 - 2.5), // Random % change
          previous_close: Math.random() * 500 + 50,
          open: Math.random() * 500 + 50,
          day_high: Math.random() * 500 + 50,
          day_low: Math.random() * 500 + 50,
          volume: Math.floor(Math.random() * 10000000),
          market_cap: Math.floor(Math.random() * 2000) * 1e9,
          pe_ratio: Math.random() * 30 + 5,
          eps: Math.random() * 10 + 1,
          dividend_yield: Math.random() * 0.05,
          sector: "Technology",
          industry: "Consumer Electronics",
          description: `Detailed description for ${stock.name} (${stock.symbol}). This company is a leader in its field, innovating in various areas of technology and consumer products.`,
          website: `https://www.${stock.symbol.toLowerCase()}.example.com`,
          logo_url: `https://logo.clearbit.com/${stock.name.toLowerCase().replace(/ /g, '').replace(/\./g, '')}.com` // Example logo URL
        });
      } else {
        resolve(null); // Stock not found
      }
    }, SIMULATED_DELAY);
  });
};

export const fetchStockCandleData = async (
    symbol: string, 
    resolution: string = "D", // D, W, M
    from: number = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year ago
    to: number = Math.floor(Date.now() / 1000) // today
): Promise<StockCandle[]> => {
    console.log(`API: Fetching candle data for ${symbol} (${resolution}) from ${new Date(from*1000).toLocaleDateString()} to ${new Date(to*1000).toLocaleDateString()}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const data: StockCandle[] = [];
            let currentDate = from * 1000;
            const endDate = to * 1000;
            let lastClose = Math.random() * 200 + 50;

            while (currentDate <= endDate) {
                const open = lastClose * (1 + (Math.random() - 0.5) * 0.05); // Vary by up to 5%
                const close = open * (1 + (Math.random() - 0.5) * 0.1); // Vary by up to 10% from open
                const high = Math.max(open, close) * (1 + Math.random() * 0.03);
                const low = Math.min(open, close) * (1 - Math.random() * 0.03);
                const volume = Math.floor(Math.random() * 1000000) + 500000;
                
                data.push({ date: Math.floor(currentDate / 1000), open, high, low, close, volume });
                
                lastClose = close;
                // Increment date based on resolution (simplified)
                let step = 24 * 60 * 60 * 1000; // Daily
                if (resolution === 'W') step *= 7;
                if (resolution === 'M') step *= 30; // Simplified month
                currentDate += step;
            }
            resolve(data);
        }, SIMULATED_DELAY);
    });
};

// --- Portfolio Data ---
// Reusing mock data from PortfoliosPage for listing
// This will cause an error if mockPortfoliosData is not exported from PortfoliosPage.tsx
// For now, we'll assume it might be, or this will need adjustment.
// A better approach is to move mock data to a shared location.

// Placeholder for mockPortfoliosData as it's not directly exportable from a page component file
// In a real scenario, this data would come from a service or a dedicated mock data file.
const mockPortfoliosDataFallback: PortfolioCardData[] = [
  { id: '1', name: 'Tech Growth Fallback', totalValue: 125680.75, totalProfitLoss: 15230.50, totalProfitLossPercentage: 13.8, currency: 'USD' },
  { id: '2', name: 'Retirement Fallback', totalValue: 340210.00, totalProfitLoss: -5850.20, totalProfitLossPercentage: -1.69, currency: 'USD'},
];


export const fetchUserPortfolios = async (): Promise<PortfolioCardData[]> => {
  console.log("API: Fetching user portfolios list");
  return new Promise(resolve => {
    setTimeout(() => {
      // Attempt to use imported mock data if PortfoliosPage exports it, otherwise use fallback
      // This dynamic import or conditional logic is complex for a simple mock.
      // For now, using a fallback or assuming it might be made available.
      // To properly fix, mockPortfoliosData should be in a separate file and exported.
      resolve(mockPortfoliosDataFallback); // Using fallback for now
    }, SIMULATED_DELAY);
  });
};

export const fetchPortfolioDetails = async (portfolioId: string): Promise<PortfolioDetail | null> => {
    console.log(`API: Fetching details for portfolio ID "${portfolioId}"`);
    return new Promise(resolve => {
        setTimeout(() => {
            const basePortfolio = mockPortfoliosDataFallback.find(p => p.id === portfolioId);
            if (!basePortfolio) {
                resolve(null);
                return;
            }

            // Generate some mock holdings and transactions
            const holdings: any[] = [ // Using 'any' for mock, should match Holding type from supabase.ts via api.ts
                { id: 1, portfolio_id: parseInt(portfolioId), stock_id: 1, /*stock_symbol: 'AAPL',*/ quantity: 50, average_buy_price: 150.00, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
                { id: 2, portfolio_id: parseInt(portfolioId), stock_id: 2, /*stock_symbol: 'MSFT',*/ quantity: 30, average_buy_price: 280.00, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
                { id: 3, portfolio_id: parseInt(portfolioId), stock_id: 6, /*stock_symbol: 'NVDA',*/ quantity: 20, average_buy_price: 450.00, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            ];
            const transactions: any[] = [ // Using 'any' for mock, should match Transaction type from supabase.ts via api.ts
                { id: 1, portfolio_id: parseInt(portfolioId), stock_id: 1, /*stock_symbol: 'AAPL',*/ type: 'buy', quantity: 25, price_per_unit: 140.00, transaction_date: new Date(Date.now() - 60*24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
                { id: 2, portfolio_id: parseInt(portfolioId), stock_id: 1, /*stock_symbol: 'AAPL',*/ type: 'buy', quantity: 25, price_per_unit: 160.00, transaction_date: new Date(Date.now() - 30*24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
                { id: 3, portfolio_id: parseInt(portfolioId), stock_id: 2, /*stock_symbol: 'MSFT',*/ type: 'buy', quantity: 30, price_per_unit: 280.00, transaction_date: new Date(Date.now() - 90*24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
                { id: 4, portfolio_id: parseInt(portfolioId), stock_id: 6, /*stock_symbol: 'NVDA',*/ type: 'buy', quantity: 20, price_per_unit: 450.00, transaction_date: new Date(Date.now() - 10*24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
            ];

            const detailedPortfolio: PortfolioDetail = {
                // Base properties from Portfolio (via PortfolioCardData)
                id: parseInt(basePortfolio.id), // Assuming id in PortfolioCardData is string, Portfolio expects number
                name: basePortfolio.name,
                description: `Details for ${basePortfolio.name}`, // Add mock description
                
                // Fields from supabase.Portfolio
                user_id: 'mock-user-id', 
                created_at: new Date(Date.now() - 365*24*60*60*1000).toISOString(), // Older creation date
                updated_at: new Date().toISOString(),
                
                // Extended fields for PortfolioDetail
                holdings: holdings,
                transactions: transactions,
                total_value: basePortfolio.totalValue,
                total_profit_loss: basePortfolio.totalProfitLoss,
                total_profit_loss_percentage: basePortfolio.totalProfitLossPercentage,
            };
            resolve(detailedPortfolio);
        }, SIMULATED_DELAY);
    });
};

// --- News ---
export const fetchNews = async (category: string = "general", query?: string): Promise<NewsArticle[]> => {
  console.log(`API: Fetching news for category "${category}" ${query ? `with query "${query}"` : ''}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const news: NewsArticle[] = [
        { id: '1', source: 'MarketWatch', headline: 'Stocks Rally on Positive Economic Data', summary: 'Major indices saw significant gains today as new economic reports indicate strong growth and low unemployment.', published_at: new Date().toISOString(), url: '#', symbols_mentioned: ['^DJI', '^GSPC'], image_url: 'https://via.placeholder.com/150/2ECC71/FFFFFF?text=MarketRally' },
        { id: '2', source: 'Reuters', headline: 'Tech Giants Post Strong Earnings for Q3', summary: 'Apple, Microsoft, and Google parent Alphabet all reported earnings that beat analyst expectations, signaling a robust tech sector.', published_at: new Date(Date.now() - 1*60*60*1000).toISOString(), url: '#', symbols_mentioned: ['AAPL', 'MSFT', 'GOOGL'], image_url: 'https://via.placeholder.com/150/3498DB/FFFFFF?text=TechEarnings' },
        { id: '3', source: 'Bloomberg', headline: 'Oil Prices Fluctuate Amid Geopolitical Tensions and OPEC+ Decisions', summary: 'Crude oil prices experienced volatility this week due to ongoing international events and upcoming OPEC+ production meetings.', published_at: new Date(Date.now() - 2*60*60*1000).toISOString(), url: '#', symbols_mentioned: ['CL=F', 'BZ=F'], image_url: 'https://via.placeholder.com/150/E67E22/FFFFFF?text=OilPrices' },
        { id: '4', source: 'Finnhub Press', headline: `${query || 'Market'} Update: ${category} sector sees movement.`, summary: `Activity in the ${category} sector has been noteworthy. ${query ? 'Specifically, ' + query.toUpperCase() + ' is on the move.' : ''}`, published_at: new Date(Date.now() - 3*60*60*1000).toISOString(), url: '#', symbols_mentioned: query ? [query.toUpperCase()] : [], image_url: 'https://via.placeholder.com/150/9B59B6/FFFFFF?text=MarketUpdate' },
        { id: '5', source: "Yahoo Finance", headline: "Federal Reserve Signals Potential Interest Rate Hikes in Coming Months", summary: "Fed Chair hinted at possible rate increases to combat inflation, causing ripples in bond and equity markets.", published_at: new Date(Date.now() - 5*60*60*1000).toISOString(), url: "#", symbols_mentioned: ["^TNX"], image_url: 'https://via.placeholder.com/150/F1C40F/000000?text=FedRateHike' }
      ];
      resolve(news.filter(article => query ? article.headline.toLowerCase().includes(query.toLowerCase()) || article.symbols_mentioned?.includes(query.toUpperCase()) : true));
    }, SIMULATED_DELAY);
  });
};

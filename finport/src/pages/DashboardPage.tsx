// Example for src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import {
  fetchStockDetails, // To simulate fetching index data
  searchStocks,      // For trending stocks
  fetchNews,
  fetchUserPortfolios,
} from '@/services/api'; // Adjust path if needed
import { StockDetails, StockSearchResult, NewsArticle } from '@/types/api'; // Adjust path
import { PortfolioCardData } from '@/components/PortfolioCard'; // Adjust path if needed
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust path
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardPage = () => {
  // States for data
  const [marketOverview, setMarketOverview] = useState<StockDetails[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<StockSearchResult[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [portfolioSnapshot, setPortfolioSnapshot] = useState<PortfolioCardData | null>(null);

  // Loading states
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  const valueFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const percentFormatter = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });


  useEffect(() => {
    // Fetch Market Overview (simulating indices)
    const fetchMarketData = async () => {
      setLoadingMarket(true);
      const indexSymbols = ['^GSPC', '^IXIC', '^DJI']; // Mock symbols for indices
      const promises = indexSymbols.map(symbol => fetchStockDetails(symbol));
      const results = (await Promise.all(promises)).filter(Boolean) as StockDetails[];
      setMarketOverview(results);
      setLoadingMarket(false);
    };

    // Fetch Trending Stocks
    const fetchTrendingData = async () => {
      setLoadingTrending(true);
      const results = await searchStocks('top gainers'); // Mock query
      setTrendingStocks(results.slice(0, 5)); // Take top 5
      setLoadingTrending(false);
    };

    // Fetch Latest News
    const fetchNewsData = async () => {
      setLoadingNews(true);
      const results = await fetchNews('general');
      setLatestNews(results.slice(0, 3)); // Take top 3
      setLoadingNews(false);
    };

    // Fetch Portfolio Snapshot
    const fetchPortfolioData = async () => {
      setLoadingPortfolio(true);
      const portfolios = await fetchUserPortfolios();
      if (portfolios && portfolios.length > 0) {
        // For snapshot, let's just use the first portfolio or sum them up
        // Here, using the first one:
        setPortfolioSnapshot(portfolios[0]); 
      }
      setLoadingPortfolio(false);
    };

    fetchMarketData();
    fetchTrendingData();
    fetchNewsData();
    fetchPortfolioData();
  }, []);

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Market Overview Section */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Key market indices and performance.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingMarket ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : marketOverview.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {marketOverview.map(index => (
                <Card key={index.symbol}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{index.symbol}</CardTitle>
                    <CardDescription>{index.name.substring(0,20)}...</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{valueFormatter.format(index.current_price)}</p>
                    <div className={`flex items-center text-sm ${index.change_today >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {index.change_today >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {percentFormatter.format(index.change_today_percent)}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <p>No market data available.</p>}
        </CardContent>
      </Card>

      {/* Portfolio Snapshot Section */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Snapshot</CardTitle>
          <CardDescription>A quick look at your primary portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPortfolio ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : portfolioSnapshot ? (
            <div>
              <p className="text-lg font-semibold">{portfolioSnapshot.name}</p>
              <p className="text-2xl font-bold">{valueFormatter.format(portfolioSnapshot.totalValue)}</p>
              <div className={`flex items-center text-sm font-semibold ${portfolioSnapshot.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioSnapshot.totalProfitLoss >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {valueFormatter.format(portfolioSnapshot.totalProfitLoss)} ({percentFormatter.format(portfolioSnapshot.totalProfitLossPercentage)}%)
              </div>
            </div>
          ) : <p>No portfolio data available.</p>}
        </CardContent>
      </Card>

      {/* Trending Stocks Section */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Trending Stocks</CardTitle>
          <CardDescription>Hot stocks in the market right now.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTrending ? (
             <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : trendingStocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingStocks.map(stock => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <p>No trending stocks available.</p>}
        </CardContent>
      </Card>

      {/* Latest News Section */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
          <CardDescription>Top financial news headlines.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingNews ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : latestNews.length > 0 ? (
            <ul className="space-y-3">
              {latestNews.map(news => (
                <li key={news.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                  <a href={news.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary">{news.headline}</a>
                  <p className="text-xs text-muted-foreground">{news.source} - {new Date(news.published_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : <p>No news available.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

// Example for src/components/PortfolioCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Assuming button is available
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"; // Icons for P/L

export interface PortfolioCardData {
  id: string | number;
  name: string;
  totalValue: number;
  currency?: string; // e.g., "USD"
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  // In the future, maybe a small array of data points for a sparkline chart
  // chartData?: number[];
}

interface PortfolioCardProps {
  portfolio: PortfolioCardData;
  onViewDetails?: (portfolioId: string | number) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onViewDetails }) => {
  const {
    id,
    name,
    totalValue,
    currency = "USD",
    totalProfitLoss,
    totalProfitLossPercentage,
  } = portfolio;

  const isPositiveProfit = totalProfitLoss >= 0;
  const valueFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency });
  const percentageFormatter = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card className="w-full max-w-sm flex flex-col"> {/* Added flex flex-col for footer to stick at bottom */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>Overall Performance</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow"> {/* Added flex-grow to push footer down */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold">{valueFormatter.format(totalValue)}</p>
        </div>
        <div className="mb-4">
          <p className="text-xs text-muted-foreground">Total Profit / Loss</p>
          <div className={`flex items-center font-semibold ${isPositiveProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveProfit ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            {valueFormatter.format(totalProfitLoss)}
            <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${isPositiveProfit ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
              {isPositiveProfit ? '+' : ''}{percentageFormatter.format(totalProfitLossPercentage / 100)}
            </span>
          </div>
        </div>
        
        {/* Placeholder for mini-chart */}
        <div className="h-24 bg-muted/50 rounded-md flex items-center justify-center my-4">
          <p className="text-sm text-muted-foreground">[Mini Chart Placeholder]</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onViewDetails && onViewDetails(id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortfolioCard;

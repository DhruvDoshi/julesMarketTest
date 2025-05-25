// Example for src/pages/PortfoliosPage.tsx
import PortfolioCard, { PortfolioCardData } from '@/components/PortfolioCard'; // Adjust path if needed
import { Button } from '@/components/ui/button'; // Adjust path if needed
import { PlusCircle } from 'lucide-react';

const mockPortfoliosData: PortfolioCardData[] = [
  {
    id: '1',
    name: 'Tech Growth',
    totalValue: 125680.75,
    totalProfitLoss: 15230.50,
    totalProfitLossPercentage: 13.8,
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Retirement Fund',
    totalValue: 340210.00,
    totalProfitLoss: -5850.20,
    totalProfitLossPercentage: -1.69,
    currency: 'USD',
  },
  {
    id: '3',
    name: 'Crypto Adventures',
    totalValue: 45900.00,
    totalProfitLoss: 18500.00,
    totalProfitLossPercentage: 67.27,
    currency: 'USD',
  },
  {
    id: '4',
    name: 'Dividend Income',
    totalValue: 88000.50,
    totalProfitLoss: 7500.00,
    totalProfitLossPercentage: 9.32,
    currency: 'USD',
  },
];

const PortfoliosPage = () => {
  const handleCreatePortfolio = () => {
    console.log('Create New Portfolio button clicked');
    // Later, this would open a modal or navigate to a form
  };

  const handleViewPortfolioDetails = (portfolioId: string | number) => {
    console.log('View details for portfolio:', portfolioId);
    // Later, this would navigate to a detailed portfolio view page
    // e.g., navigate(`/portfolios/${portfolioId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Portfolios</h1>
        <Button onClick={handleCreatePortfolio}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Portfolio
        </Button>
      </div>

      {mockPortfoliosData.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          <p className="text-lg">You don't have any portfolios yet.</p>
          <Button variant="link" onClick={handleCreatePortfolio} className="mt-2">
            Create your first portfolio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPortfoliosData.map((portfolio) => (
            <PortfolioCard 
              key={portfolio.id} 
              portfolio={portfolio} 
              onViewDetails={handleViewPortfolioDetails} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfoliosPage;

import StockSearchBar from '@/components/StockSearchBar'; // Adjust path if needed

const StockSearchPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Search</h1>
      <StockSearchBar onStockSelect={(stock) => console.log('Selected on page:', stock)} />
      {/* Display search results or selected stock info here later */}
    </div>
  );
};
export default StockSearchPage;

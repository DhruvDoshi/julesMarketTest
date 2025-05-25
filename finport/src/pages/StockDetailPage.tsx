import { useParams } from 'react-router-dom';
const StockDetailPage = () => {
  const { symbol } = useParams();
  return <div>Stock Detail Page for {symbol}</div>;
};
export default StockDetailPage;

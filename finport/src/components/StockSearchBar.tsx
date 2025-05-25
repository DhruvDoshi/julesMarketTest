import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react"; // Or any other icon for the trigger

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Optional, if using a trigger button
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input"; // Using Input directly

// Mock stock data
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc. (Class A)" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "BRK.A", name: "Berkshire Hathaway Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
];

interface Stock {
  symbol: string;
  name: string;
}

interface StockSearchBarProps {
  onStockSelect?: (stock: Stock) => void;
}

const StockSearchBar: React.FC<StockSearchBarProps> = ({ onStockSelect }) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredStocks, setFilteredStocks] = React.useState<Stock[]>(mockStocks);
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

  React.useEffect(() => {
    if (searchTerm === "") {
      setFilteredStocks(mockStocks.slice(0, 10)); // Show some initial stocks or popular ones
    } else {
      setFilteredStocks(
        mockStocks.filter(stock =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setSearchTerm(value); // Trigger filtering
    if (value) {
      setOpen(true); // Open popover when typing
    } else {
      setOpen(false);
    }
  };
  
  const handleSelectStock = (stock: Stock) => {
    setInputValue(`${stock.symbol} - ${stock.name}`);
    setSelectedStock(stock);
    setSearchTerm(""); // Clear search term
    setOpen(false); // Close popover
    if (onStockSelect) {
      onStockSelect(stock);
    }
    console.log("Selected stock:", stock);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* 
          Using Input directly as the trigger.
          Alternatively, a Button can be used to open a CommandDialog or a Popover with Command.
          For a search bar, direct input is more natural.
        */}
        <div className="relative w-full max-w-xs"> {/* Adjust width as needed */}
          <Input
            type="text"
            placeholder="Search stocks (e.g., AAPL)"
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setOpen(true)} // Open on click if not already open
            className="w-full"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false} > {/* We do custom filtering */}
          {/* 
            CommandInput is useful if you want the search within the popover itself.
            If the main Input serves as the search field, CommandInput might be redundant
            or could be used to refine within the already filtered list.
            For this setup, we'll use the main Input's value for filtering.
          */}
          {/* <CommandInput placeholder="Search stock..." value={searchTerm} onValueChange={setSearchTerm} /> */}
          <CommandList>
            <CommandEmpty>{filteredStocks.length === 0 && searchTerm !== "" ? "No stock found." : "Start typing to see results."}</CommandEmpty>
            {searchTerm && filteredStocks.length > 0 && (
              <CommandGroup heading="Results">
                {filteredStocks.map((stock) => (
                  <CommandItem
                    key={stock.symbol}
                    value={`${stock.symbol}-${stock.name}`} // Unique value for CommandItem
                    onSelect={() => handleSelectStock(stock)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStock?.symbol === stock.symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="ml-2 text-muted-foreground">{stock.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StockSearchBar;

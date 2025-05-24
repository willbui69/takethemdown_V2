
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchAndFilter = ({ searchQuery, onSearchChange }: SearchAndFilterProps) => {
  // Enhanced input validation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Basic sanitization - remove potentially harmful characters
    const sanitizedValue = value
      .replace(/[<>'"]/g, '') // Remove HTML/script injection characters
      .replace(/[{}]/g, '') // Remove object notation characters
      .slice(0, 100); // Limit length
    
    onSearchChange(sanitizedValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên nạn nhân, nhóm, hoặc quốc gia..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
          maxLength={100}
          pattern="[a-zA-Z0-9\s._-]*"
          title="Chỉ cho phép chữ cái, số, dấu cách, dấu chấm, gạch ngang và gạch dưới"
        />
      </div>
    </div>
  );
};

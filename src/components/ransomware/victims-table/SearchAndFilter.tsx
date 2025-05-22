
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange 
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm nạn nhân, nhóm, quốc gia..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="h-4 w-4" /> 
        Lọc
      </Button>
    </div>
  );
};

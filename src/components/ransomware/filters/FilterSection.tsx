
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
  industryFilter: string;
  setIndustryFilter: (value: string) => void;
  countries: string[];
  industries: string[];
  resetFilters: () => void;
}

export const FilterSection = ({
  searchQuery,
  setSearchQuery,
  countryFilter,
  setCountryFilter,
  industryFilter,
  setIndustryFilter,
  countries,
  industries,
  resetFilters
}: FilterSectionProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search and filter toggle row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm nạn nhân, nhóm, quốc gia..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" /> 
          {showFilters ? "Ẩn Bộ Lọc" : "Hiển Thị Bộ Lọc"}
        </Button>
      </div>

      {/* Advanced filters section */}
      {showFilters && (
        <div className="p-4 border rounded-md bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="country-filter" className="text-sm font-medium">Quốc Gia</label>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger id="country-filter">
                <SelectValue placeholder="Tất cả quốc gia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả quốc gia</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="industry-filter" className="text-sm font-medium">Ngành</label>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger id="industry-filter">
                <SelectValue placeholder="Tất cả ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả ngành</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="secondary" 
              onClick={resetFilters}
              className="w-full"
            >
              Xóa Bộ Lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


import { useState } from "react";
import { RansomwareVictim } from "@/types/ransomware";
import { Table, TableBody, TableCell } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { VictimTableHeader } from "./tables/VictimTableHeader";
import { VictimTableRow } from "./tables/VictimTableRow";
import { FilterSection } from "./filters/FilterSection";
import { ExpandControl } from "./tables/ExpandControl";
import { 
  formatDate, 
  getIndustryColor,
  processVictimData 
} from "./utils/victimTableUtils";

interface VictimsTableProps {
  victims: RansomwareVictim[];
  loading: boolean;
}

export const VictimsTable = ({ victims, loading }: VictimsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof RansomwareVictim>("published");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedView, setExpandedView] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  
  const handleSort = (field: keyof RansomwareVictim) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Toggle expanded view
  const toggleExpandedView = () => {
    if (expandedView) {
      setItemsToShow(10); // Collapse to default
    } else {
      setItemsToShow(victims.length); // Show all
    }
    setExpandedView(!expandedView);
  };
  
  // Extract unique countries and industries for filter dropdowns
  const countries = Array.from(new Set(victims
    .map(victim => victim.country)
    .filter(country => country !== null && country !== undefined && country !== "")))
    .sort() as string[];
    
  const industries = Array.from(new Set(victims
    .map(victim => victim.industry)
    .filter(industry => industry !== null && industry !== undefined && industry !== "")))
    .sort() as string[];
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setCountryFilter("");
    setIndustryFilter("");
  };
  
  // Filter victims based on all criteria
  const filteredVictims = victims.filter(victim => {
    // Text search across multiple fields
    const matchesSearch = !searchQuery ? true : (
      (victim.victim_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (victim.group_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (victim.country?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (victim.industry?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
    
    // Country filter
    const matchesCountry = !countryFilter ? true : 
      victim.country?.toLowerCase() === countryFilter.toLowerCase();
    
    // Industry filter
    const matchesIndustry = !industryFilter ? true :
      victim.industry?.toLowerCase() === industryFilter.toLowerCase();
    
    return matchesSearch && matchesCountry && matchesIndustry;
  });
  
  // Process the filtered victims to standardize name extraction
  const processedVictims = processVictimData(filteredVictims);
  
  // Sort the processed victims
  const sortedVictims = [...processedVictims].sort((a, b) => {
    const fieldA = a[sortField] || "";
    const fieldB = b[sortField] || "";
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Get the subset of victims to show
  const visibleVictims = sortedVictims.slice(0, itemsToShow);

  return (
    <div className="space-y-4">
      <FilterSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        countries={countries}
        industries={industries}
        resetFilters={resetFilters}
      />

      {sortedVictims.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-700">Không có dữ liệu nạn nhân phù hợp với tiêu chí của bạn</p>
        </div>
      )}

      <div className="rounded-md border overflow-auto">
        <Table>
          <VictimTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
          <TableBody>
            {loading ? (
              <tr>
                <TableCell colSpan={5} className="h-24 text-center">
                  Đang tải dữ liệu nạn nhân...
                </TableCell>
              </tr>
            ) : sortedVictims.length === 0 ? (
              <tr>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy nạn nhân phù hợp với tiêu chí của bạn
                </TableCell>
              </tr>
            ) : (
              visibleVictims.map((victim, index) => (
                <VictimTableRow
                  key={index}
                  victim={victim}
                  index={index}
                  formatDate={formatDate}
                  getIndustryColor={getIndustryColor}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <ExpandControl
        totalCount={sortedVictims.length}
        visibleCount={10}
        expandedView={expandedView}
        toggleExpandedView={toggleExpandedView}
      />

      {/* Filter summary with count */}
      <div className="text-sm text-gray-500 flex flex-wrap justify-between items-center">
        <div>
          {(searchQuery || countryFilter || industryFilter) && (
            <span className="text-security">
              Đang lọc: 
              {searchQuery && <span className="ml-1">"{searchQuery}"</span>}
              {countryFilter && <span className="ml-1">Quốc Gia: {countryFilter}</span>}
              {industryFilter && <span className="ml-1">Ngành: {industryFilter}</span>}
            </span>
          )}
        </div>
        <div>
          Hiển thị {visibleVictims.length} trong số {sortedVictims.length} nạn nhân
        </div>
      </div>
    </div>
  );
};

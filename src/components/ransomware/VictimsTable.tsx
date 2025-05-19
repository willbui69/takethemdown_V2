
import { useState } from "react";
import { RansomwareVictim } from "@/types/ransomware";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, AlertTriangle, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VictimsTableProps {
  victims: RansomwareVictim[];
  loading: boolean;
}

export const VictimsTable = ({ victims, loading }: VictimsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof RansomwareVictim>("published");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const handleSort = (field: keyof RansomwareVictim) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Filter victims based on search query
  const filteredVictims = victims.filter(victim => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (victim.victim_name?.toLowerCase() || "").includes(searchLower) ||
      (victim.group_name?.toLowerCase() || "").includes(searchLower) ||
      (victim.country?.toLowerCase() || "").includes(searchLower) ||
      (victim.industry?.toLowerCase() || "").includes(searchLower)
    );
  });
  
  // Enhanced data processing to handle all possible field variations
  const processedVictims = filteredVictims.map(victim => {
    // Enhanced victim name extraction with strict validation
    let victimName = "Unknown Organization";
    
    // First try using the 'victim' field, which seems to contain the actual organization name
    if (victim.victim && typeof victim.victim === 'string' && victim.victim.trim() !== '' && 
        victim.victim !== 'null' && victim.victim !== 'undefined' && 
        !victim.victim.includes('ransomware.live')) {
      victimName = victim.victim;
    } 
    // Then try domain
    else if (victim.domain && typeof victim.domain === 'string' && victim.domain.trim() !== '' && 
             victim.domain !== 'null' && victim.domain !== 'undefined' &&
             !victim.domain.includes('ransomware.live')) {
      victimName = victim.domain;
    }
    // Fall back to other fields
    else if (victim.victim_name && typeof victim.victim_name === 'string' && victim.victim_name.trim() !== '' && 
             victim.victim_name !== 'null' && victim.victim_name !== 'undefined' &&
             !victim.victim_name.includes('ransomware.live')) {
      victimName = victim.victim_name;
    } 
    else if (victim.company && typeof victim.company === 'string' && victim.company.trim() !== '' && 
             victim.company !== 'null' && victim.company !== 'undefined') {
      victimName = victim.company;
    } 
    else if (victim.title && typeof victim.title === 'string' && victim.title.trim() !== '' && 
             victim.title !== 'null' && victim.title !== 'undefined') {
      victimName = victim.title;
    } 
    else if (victim.name && typeof victim.name === 'string' && victim.name.trim() !== '' && 
             victim.name !== 'null' && victim.name !== 'undefined') {
      victimName = victim.name;
    }
    else if (victim.url && typeof victim.url === 'string' && victim.url.trim() !== '') {
      // Try to extract name from URL only if we have no other options
      try {
        const urlObj = new URL(victim.url);
        const hostname = urlObj.hostname.replace('www.', '');
        // Only use the hostname if it's not ransomware.live
        if (!hostname.includes('ransomware.live')) {
          victimName = hostname;
        }
      } catch (e) {
        // If URL parsing fails, use the URL as is or fallback
        const urlString = victim.url.replace(/^https?:\/\//, '');
        if (!urlString.includes('ransomware.live')) {
          victimName = urlString;
        }
      }
    }
    
    // Enhanced date extraction
    const publishDate = 
      victim.discovered || 
      victim.discovery_date ||
      victim.published || 
      victim.date || 
      victim.leaked ||
      null;
    
    // Extract industry information, check 'activity' field first which seems more reliable
    const industry = victim.activity || victim.industry || victim.sector || null;
    
    // Ensure we return a properly structured object
    return {
      ...victim,
      victim_name: victimName,
      group_name: victim.group_name || victim.group || "Unknown Group",
      published: publishDate,
      country: victim.country || null,
      industry: industry,
      url: victim.url || victim.claim_url || victim.victim_url || null,
    };
  });
  
  // Sort the processed victims
  const sortedVictims = [...processedVictims].sort((a, b) => {
    const fieldA = a[sortField] || "";
    const fieldB = b[sortField] || "";
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Không rõ";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if not a valid date
      }
      return date.toLocaleDateString(undefined, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  };

  const getIndustryColor = (industry: string | null) => {
    if (!industry) return "gray";
    
    const industryLower = industry.toLowerCase();
    
    if (industryLower.includes("finance") || industryLower.includes("bank")) return "blue";
    if (industryLower.includes("health") || industryLower.includes("medical")) return "red";
    if (industryLower.includes("education") || industryLower.includes("school")) return "yellow";
    if (industryLower.includes("tech") || industryLower.includes("it")) return "green";
    if (industryLower.includes("government") || industryLower.includes("public")) return "purple";
    if (industryLower.includes("manufacturing")) return "orange";
    
    return "gray";
  };

  return (
    <div className="space-y-4">
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
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> 
          Lọc
        </Button>
      </div>

      {sortedVictims.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-700">Không có dữ liệu nạn nhân phù hợp với tiêu chí của bạn</p>
        </div>
      )}

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("victim_name")}
              >
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Tổ Chức
                  {sortField === "victim_name" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("group_name")}
              >
                Nhóm
                {sortField === "group_name" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("published")}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Công Bố
                  {sortField === "published" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("industry")}
              >
                Ngành
                {sortField === "industry" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("country")}
              >
                Quốc Gia
                {sortField === "country" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Đang tải dữ liệu nạn nhân...
                </TableCell>
              </TableRow>
            ) : sortedVictims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy nạn nhân phù hợp với tiêu chí của bạn
                </TableCell>
              </TableRow>
            ) : (
              sortedVictims.map((victim, index) => (
                <TableRow key={`${victim.group_name}-${victim.victim_name}-${index}`}>
                  <TableCell className="font-medium">
                    {victim.url ? (
                      <a 
                        href={victim.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-security hover:underline"
                      >
                        {victim.victim_name}
                      </a>
                    ) : (
                      victim.victim_name
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {victim.group_name}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(victim.published)}</TableCell>
                  <TableCell>
                    {victim.industry ? (
                      <Badge variant="outline" className={`bg-${getIndustryColor(victim.industry)}-50 text-${getIndustryColor(victim.industry)}-700 border-${getIndustryColor(victim.industry)}-200`}>
                        {victim.industry}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">Không rõ</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {victim.country || <span className="text-gray-500 text-sm">Không rõ</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500 text-right">
        Hiển thị {sortedVictims.length} trong số {victims.length} nạn nhân
      </div>
    </div>
  );
};

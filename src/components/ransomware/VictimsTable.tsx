
import { useState } from "react";
import { RansomwareVictim } from "@/types/ransomware";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

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
  
  const filteredVictims = victims.filter(victim => {
    const searchLower = searchQuery.toLowerCase();
    return (
      victim.victim_name.toLowerCase().includes(searchLower) ||
      victim.group_name.toLowerCase().includes(searchLower) ||
      (victim.country && victim.country.toLowerCase().includes(searchLower)) ||
      (victim.industry && victim.industry.toLowerCase().includes(searchLower))
    );
  });
  
  const sortedVictims = [...filteredVictims].sort((a, b) => {
    const fieldA = a[sortField] || "";
    const fieldB = b[sortField] || "";
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
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

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("victim_name")}
              >
                Tổ Chức
                {sortField === "victim_name" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
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
                Công Bố
                {sortField === "published" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
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
                  <TableCell>{victim.group_name}</TableCell>
                  <TableCell>{formatDate(victim.published)}</TableCell>
                  <TableCell>{victim.industry || "Không rõ"}</TableCell>
                  <TableCell>{victim.country || "Không rõ"}</TableCell>
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

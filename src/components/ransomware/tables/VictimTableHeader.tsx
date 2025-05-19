
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar } from "lucide-react";

// Define the same type as in VictimsTable
type SortableField = 'victim_name' | 'group_name' | 'published' | 'country' | 'industry';

interface VictimTableHeaderProps {
  sortField: SortableField;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: SortableField) => void;
}

export const VictimTableHeader = ({ 
  sortField, 
  sortDirection, 
  handleSort 
}: VictimTableHeaderProps) => {
  return (
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
  );
};


import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RansomwareVictim } from "@/types/ransomware";

interface VictimTableHeaderProps {
  sortField: keyof RansomwareVictim;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof RansomwareVictim) => void;
}

export const VictimTableHeader = ({
  sortField,
  sortDirection,
  onSort
}: VictimTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("victim_name")}
        >
          Tổ Chức
          {sortField === "victim_name" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("group_name")}
        >
          Nhóm
          {sortField === "group_name" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("published")}
        >
          Công Bố
          {sortField === "published" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("industry")}
        >
          Ngành
          {sortField === "industry" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("country")}
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

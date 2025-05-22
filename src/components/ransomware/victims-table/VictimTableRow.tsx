
import { TableCell, TableRow } from "@/components/ui/table";
import { RansomwareVictim } from "@/types/ransomware";
import { Badge } from "@/components/ui/badge";
import { formatDate, getIndustryColor } from "./utils";

interface VictimTableRowProps {
  victim: RansomwareVictim;
  index: number;
}

export const VictimTableRow = ({ victim, index }: VictimTableRowProps) => {
  return (
    <TableRow key={`${victim.group_name}-${victim.victim_name}-${index}`}>
      <TableCell className="font-medium">
        {victim.victim_name || "Unknown"}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-medium">
          {victim.group_name || "Unknown Group"}
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
  );
};

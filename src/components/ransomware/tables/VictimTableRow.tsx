
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RansomwareVictim } from "@/types/ransomware";

interface VictimTableRowProps {
  victim: RansomwareVictim;
  index: number;
  formatDate: (dateString: string | null) => string;
  getIndustryColor: (industry: string | null) => string;
}

export const VictimTableRow = ({ 
  victim, 
  index, 
  formatDate, 
  getIndustryColor 
}: VictimTableRowProps) => {
  return (
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
  );
};

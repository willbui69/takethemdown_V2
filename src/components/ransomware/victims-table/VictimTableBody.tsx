
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RansomwareVictim } from "@/types/ransomware";
import { VictimTableRow } from "./VictimTableRow";

interface VictimTableBodyProps {
  displayedVictims: RansomwareVictim[];
  loading: boolean;
}

export const VictimTableBody = ({
  displayedVictims,
  loading
}: VictimTableBodyProps) => {
  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            Đang tải dữ liệu nạn nhân...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  if (displayedVictims.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            Không tìm thấy nạn nhân phù hợp với tiêu chí của bạn
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  return (
    <TableBody>
      {displayedVictims.map((victim, index) => (
        <VictimTableRow 
          key={`${victim.group_name}-${victim.victim_name}-${index}`}
          victim={victim} 
          index={index} 
        />
      ))}
    </TableBody>
  );
};

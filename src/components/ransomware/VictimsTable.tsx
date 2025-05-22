
import { RansomwareVictim } from "@/types/ransomware";
import { Table } from "@/components/ui/table";
import { SearchAndFilter } from "./victims-table/SearchAndFilter";
import { EmptyOrErrorState } from "./victims-table/EmptyOrErrorState";
import { VictimTableHeader } from "./victims-table/VictimTableHeader";
import { VictimTableBody } from "./victims-table/VictimTableBody";
import { ShowMoreButton } from "./victims-table/ShowMoreButton";
import { useVictimTableState } from "./victims-table/useVictimTableState";

interface VictimsTableProps {
  victims: RansomwareVictim[];
  loading: boolean;
}

export const VictimsTable = ({ victims, loading }: VictimsTableProps) => {
  const {
    searchQuery,
    sortField,
    sortDirection,
    displayLimit,
    sortedVictims,
    displayedVictims,
    hasMoreVictims,
    handleSort,
    handleSearchChange,
    handleShowMore
  } = useVictimTableState(victims);
  
  // Log some of the victim data for debugging
  console.log("VictimsTable - First few victims:", victims.slice(0, 3));
  
  return (
    <div className="space-y-4">
      <SearchAndFilter 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />

      <EmptyOrErrorState 
        message="Không có dữ liệu nạn nhân phù hợp với tiêu chí của bạn" 
        loading={loading}
        isEmpty={sortedVictims.length === 0}
      />

      <div className="rounded-md border overflow-auto">
        <Table>
          <VictimTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <VictimTableBody 
            displayedVictims={displayedVictims}
            loading={loading}
          />
        </Table>
      </div>
      
      <ShowMoreButton 
        hasMoreVictims={hasMoreVictims}
        displayLimit={displayLimit}
        totalCount={sortedVictims.length}
        onShowMore={handleShowMore}
      />
    </div>
  );
};


import { useState } from "react";
import { RansomwareVictim } from "@/types/ransomware";
import { filterVictims, sortVictims } from "./utils";

export const useVictimTableState = (victims: RansomwareVictim[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof RansomwareVictim>("published");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [displayLimit, setDisplayLimit] = useState(10);
  
  const handleSort = (field: keyof RansomwareVictim) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleShowMore = () => {
    setDisplayLimit(prev => prev + 10);
  };
  
  const filteredVictims = filterVictims(victims, searchQuery);
  const sortedVictims = sortVictims(filteredVictims, sortField, sortDirection);
  const displayedVictims = sortedVictims.slice(0, displayLimit);
  const hasMoreVictims = sortedVictims.length > displayLimit;
  
  return {
    searchQuery,
    sortField,
    sortDirection,
    displayLimit,
    filteredVictims,
    sortedVictims,
    displayedVictims,
    hasMoreVictims,
    handleSort,
    handleSearchChange,
    handleShowMore
  };
};

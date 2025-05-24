
import { useState, useMemo, useCallback } from "react";
import { RansomwareVictim } from "@/types/ransomware";
import { validateSearchQuery, sanitizeInput } from "@/utils/security";

type SortField = "victim_name" | "group" | "country" | "published" | "discovered";
type SortDirection = "asc" | "desc";

export const useVictimTableState = (victims: RansomwareVictim[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("published");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [displayLimit, setDisplayLimit] = useState(50);

  // Enhanced search with validation
  const handleSearchChange = useCallback((query: string) => {
    const sanitizedQuery = sanitizeInput(query, 100);
    
    if (!validateSearchQuery(sanitizedQuery)) {
      console.warn("Invalid search query format");
      return;
    }
    
    setSearchQuery(sanitizedQuery);
  }, []);

  const sortedVictims = useMemo(() => {
    let filtered = victims;

    // Enhanced search functionality with security
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      filtered = victims.filter((victim) => {
        // Safely access properties with fallbacks
        const victimName = (victim.victim_name || victim.victim || "").toLowerCase();
        const groupName = (victim.group || "").toLowerCase();
        const country = (victim.country || "").toLowerCase();
        const domain = (victim.domain || "").toLowerCase();
        
        return victimName.includes(normalizedQuery) ||
               groupName.includes(normalizedQuery) ||
               country.includes(normalizedQuery) ||
               domain.includes(normalizedQuery);
      });
    }

    // Sort with enhanced safety checks
    return filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      try {
        switch (sortField) {
          case "victim_name":
            aValue = (a.victim_name || a.victim || "").toLowerCase();
            bValue = (b.victim_name || b.victim || "").toLowerCase();
            break;
          case "group":
            aValue = (a.group || "").toLowerCase();
            bValue = (b.group || "").toLowerCase();
            break;
          case "country":
            aValue = (a.country || "").toLowerCase();
            bValue = (b.country || "").toLowerCase();
            break;
          case "published":
            aValue = new Date(a.published || a.discovered || 0).getTime();
            bValue = new Date(b.published || b.discovered || 0).getTime();
            break;
          case "discovered":
            aValue = new Date(a.discovered || a.published || 0).getTime();
            bValue = new Date(b.discovered || b.published || 0).getTime();
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      } catch (error) {
        console.warn("Error during sorting:", error);
        return 0;
      }
    });
  }, [victims, searchQuery, sortField, sortDirection]);

  const displayedVictims = useMemo(() => {
    return sortedVictims.slice(0, displayLimit);
  }, [sortedVictims, displayLimit]);

  const hasMoreVictims = sortedVictims.length > displayLimit;

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(current => current === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  const handleShowMore = useCallback(() => {
    setDisplayLimit(current => Math.min(current + 50, sortedVictims.length));
  }, [sortedVictims.length]);

  return {
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
  };
};

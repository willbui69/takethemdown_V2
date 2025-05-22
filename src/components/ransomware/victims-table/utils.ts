
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Không rõ";
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log("Invalid date format:", dateString);
      return "Không rõ";
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Không rõ";
  }
};

export const getIndustryColor = (industry: string | null) => {
  if (!industry) return "gray";
  
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes("finance") || industryLower.includes("bank")) return "blue";
  if (industryLower.includes("health") || industryLower.includes("medical")) return "red";
  if (industryLower.includes("education") || industryLower.includes("school")) return "yellow";
  if (industryLower.includes("tech") || industryLower.includes("it")) return "green";
  if (industryLower.includes("government") || industryLower.includes("public")) return "purple";
  if (industryLower.includes("manufacturing")) return "orange";
  if (industryLower.includes("consumer")) return "indigo";
  
  return "gray";
};

export const filterVictims = (victims, searchQuery) => {
  if (!searchQuery) return victims;
  
  const searchLower = searchQuery.toLowerCase();
  return victims.filter(victim => {
    return (
      (victim.victim_name?.toLowerCase() || "").includes(searchLower) ||
      (victim.group_name?.toLowerCase() || "").includes(searchLower) ||
      (victim.country?.toLowerCase() || "").includes(searchLower) ||
      (victim.industry?.toLowerCase() || "").includes(searchLower)
    );
  });
};

export const sortVictims = (victims, sortField, sortDirection) => {
  return [...victims].sort((a, b) => {
    // Handle null or undefined values for sorting
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    // For date fields
    if (sortField === "published") {
      fieldA = fieldA ? new Date(fieldA).getTime() : 0;
      fieldB = fieldB ? new Date(fieldB).getTime() : 0;
    } else {
      // For string fields
      fieldA = fieldA || "";
      fieldB = fieldB || "";
    }
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

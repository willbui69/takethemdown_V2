
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ShowMoreButtonProps {
  hasMoreVictims: boolean;
  displayLimit: number;
  totalCount: number;
  onShowMore: () => void;
}

export const ShowMoreButton = ({
  hasMoreVictims,
  displayLimit,
  totalCount,
  onShowMore
}: ShowMoreButtonProps) => {
  if (!hasMoreVictims) return null;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <Button 
        variant="outline" 
        onClick={onShowMore} 
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <ChevronDown className="h-4 w-4" />
        Xem Thêm Nạn Nhân ({totalCount - displayLimit} còn lại)
      </Button>
      <div className="text-sm text-gray-500 text-center">
        Hiển thị {Math.min(displayLimit, totalCount)} trong số {totalCount} nạn nhân
      </div>
    </div>
  );
};

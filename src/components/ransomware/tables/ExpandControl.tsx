
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandControlProps {
  totalCount: number;
  visibleCount: number;
  expandedView: boolean;
  toggleExpandedView: () => void;
}

export const ExpandControl = ({ 
  totalCount, 
  visibleCount, 
  expandedView, 
  toggleExpandedView 
}: ExpandControlProps) => {
  if (totalCount <= 10) return null;
  
  return (
    <div className="flex justify-center mt-4">
      <Collapsible 
        className="w-full" 
        open={expandedView}
        onOpenChange={toggleExpandedView}
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            {expandedView ? (
              <>
                <ChevronUp className="h-4 w-4" /> 
                Thu gọn danh sách
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> 
                Xem thêm {totalCount - visibleCount} nạn nhân khác
              </>
            )}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
};

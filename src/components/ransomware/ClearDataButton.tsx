
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const ClearDataButton = () => {
  const [clearing, setClearing] = useState(false);

  const clearAllData = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tất cả đăng ký? Hành động này không thể hoàn tác.")) {
      return;
    }

    setClearing(true);

    try {
      const { error } = await supabase.functions.invoke('clear-subscriptions');
      
      if (error) {
        throw error;
      }

      toast.success("Đã xóa tất cả đăng ký thành công!", {
        description: "Bây giờ bạn có thể test lại với email mới."
      });

      // Reload the page to refresh the subscription list
      window.location.reload();

    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Không thể xóa dữ liệu", {
        description: "Vui lòng thử lại sau."
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <Button 
      onClick={clearAllData} 
      disabled={clearing}
      variant="destructive"
      size="sm"
      className="mb-4"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {clearing ? "Đang xóa..." : "Xóa tất cả đăng ký"}
    </Button>
  );
};

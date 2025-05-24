
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const UnsubscribeActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
      <Button 
        onClick={() => navigate("/ransomware")}
        className="bg-security hover:bg-security-light text-white font-medium py-3 px-6 rounded-lg transition-colors"
        size="lg"
      >
        Xem Trang Giám Sát
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate("/")}
        className="border-2 border-security text-security hover:bg-security hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
        size="lg"
      >
        Quay Lại Trang Chủ
      </Button>
    </div>
  );
};

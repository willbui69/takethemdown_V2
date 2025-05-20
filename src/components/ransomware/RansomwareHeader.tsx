
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleMinus, RefreshCw } from "lucide-react";

interface RansomwareHeaderProps {
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh: () => void;
  showAdminPanel: boolean;
  toggleAdminPanel: () => void;
}

export const RansomwareHeader = ({
  lastUpdated,
  loading,
  onRefresh,
  showAdminPanel,
  toggleAdminPanel
}: RansomwareHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-security">Giám Sát Ransomware</h1>
        <p className="text-gray-600">
          Theo dõi dữ liệu nạn nhân ransomware và nhận thông báo về nạn nhân mới
          {lastUpdated && (
            <span className="text-sm text-gray-500 ml-2">
              Cập nhật lần cuối: {lastUpdated.toLocaleString()}
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Làm Mới Dữ Liệu
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={toggleAdminPanel}
        >
          {showAdminPanel ? (
            <>
              <CircleMinus className="h-4 w-4" /> Ẩn Bảng Quản Trị
            </>
          ) : (
            <>
              <CirclePlus className="h-4 w-4" /> Hiển Thị Bảng Quản Trị
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

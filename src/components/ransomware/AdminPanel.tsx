
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubscription } from "@/context/SubscriptionContext";
import { Subscription, FetchHistory } from "@/types/ransomware";
import { fetchAllVictims } from "@/services/ransomwareAPI";
import { toast } from "sonner";
import { DatabaseBackup, FileSearch, Bug } from "lucide-react";
import { ClearDataButton } from "./ClearDataButton";

export const AdminPanel = () => {
  const { subscriptions } = useSubscription();
  const [fetchHistory, setFetchHistory] = useState<FetchHistory[]>([]);
  const [fetching, setFetching] = useState(false);
  
  const triggerFetch = async () => {
    if (fetching) return;
    
    setFetching(true);
    
    try {
      toast.info("Đang tải dữ liệu nạn nhân mới nhất...", {
        description: "Quá trình này có thể mất một chút thời gian",
        icon: <FileSearch className="h-5 w-5" />
      });
      
      // Get previous victim data (in a real app this would be from database)
      const previousVictims = localStorage.getItem("previousVictims");
      
      // Fetch new victims
      const newVictims = await fetchAllVictims();
      
      // Save to localStorage (in a real app, we'd save to a database)
      localStorage.setItem("previousVictims", JSON.stringify(newVictims));
      
      let newCount = 0;
      
      if (previousVictims) {
        const oldVictimsMap = new Map();
        JSON.parse(previousVictims).forEach((victim: any) => {
          oldVictimsMap.set(`${victim.group_name}-${victim.victim_name}`, true);
        });
        
        // Count new victims
        newVictims.forEach((victim) => {
          if (!oldVictimsMap.has(`${victim.group_name}-${victim.victim_name}`)) {
            newCount++;
          }
        });
      }
      
      // Create fetch history entry
      const newHistory: FetchHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        totalCount: newVictims.length,
        newCount,
        successful: true,
      };
      
      setFetchHistory(prev => [newHistory, ...prev]);
      
      if (newCount > 0) {
        toast.success(`Tìm thấy ${newCount} nạn nhân mới!`, {
          description: "Kiểm tra bảng nạn nhân để biết chi tiết",
          icon: <DatabaseBackup className="h-5 w-5" />
        });
        // In a real app, we would send notifications here
        console.log(`Sẽ gửi email thông báo về ${newCount} nạn nhân mới`);
      } else {
        toast.info("Không tìm thấy nạn nhân mới", {
          description: "Cơ sở dữ liệu đã được cập nhật"
        });
      }
      
    } catch (error) {
      console.error("Error during victim fetch:", error);
      
      const errorHistory: FetchHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        totalCount: 0,
        newCount: 0,
        successful: false,
        error: String(error),
      };
      
      setFetchHistory(prev => [errorHistory, ...prev]);
      toast.error("Không thể tải dữ liệu nạn nhân", {
        description: "Vui lòng thử lại sau",
        icon: <Bug className="h-5 w-5" />
      });
      
    } finally {
      setFetching(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Điều Khiển Quản Trị</h3>
        
        <ClearDataButton />
        
        <Button 
          onClick={triggerFetch} 
          disabled={fetching}
          className="mb-6"
        >
          {fetching ? (
            <>Đang Tải Dữ Liệu...</>
          ) : (
            <>
              <DatabaseBackup className="h-4 w-4 mr-2" />
              Kích Hoạt Tải Dữ Liệu
            </>
          )}
        </Button>
        
        <h4 className="font-medium mb-2">Lịch Sử Tải</h4>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời Gian</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Tổng Số Nạn Nhân</TableHead>
                <TableHead>Nạn Nhân Mới</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Chưa có lịch sử tải
                  </TableCell>
                </TableRow>
              ) : (
                fetchHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.timestamp)}</TableCell>
                    <TableCell>
                      {entry.successful ? (
                        <span className="text-green-600">Thành công</span>
                      ) : (
                        <span className="text-red-600" title={entry.error}>Thất bại</span>
                      )}
                    </TableCell>
                    <TableCell>{entry.totalCount}</TableCell>
                    <TableCell>{entry.newCount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Người Đăng Ký</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Đăng Ký Lúc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Chưa có người đăng ký
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub: Subscription) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>
                      {sub.verified ? (
                        <span className="text-green-600">Đã xác nhận</span>
                      ) : (
                        <span className="text-amber-600">Đang chờ</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(sub.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

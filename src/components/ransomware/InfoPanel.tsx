
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Bug, Code, Signal, Network, Clock, CloudOff, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoPanelProps {
  isGeoBlocked: boolean;
  error: string | null;
  debugInfo?: string | null;
}

export const InfoPanel = ({ isGeoBlocked, error, debugInfo }: InfoPanelProps) => {
  const [showDebug, setShowDebug] = useState(false);
  
  if (!isGeoBlocked && !error && !debugInfo) return null;
  
  return (
    <div className="mb-6 space-y-4">
      {isGeoBlocked && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Giới Hạn Địa Lý</AlertTitle>
          <AlertDescription>
            Vị trí của bạn bị chặn truy cập vào API ransomware.live. Điều này có thể do các giới hạn cụ thể theo quốc gia được áp dụng bởi nhà cung cấp API.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <div className="text-center py-4 text-amber-500 flex flex-col items-center gap-2">
          {error.includes("Failed to fetch") || error.includes("không khả dụng") || error.includes("timeout") ? (
            <Network className="h-10 w-10" />
          ) : error.includes("timed out") ? (
            <Clock className="h-10 w-10" />
          ) : error.includes("offline") || error.includes("không có kết nối") ? (
            <CloudOff className="h-10 w-10" />
          ) : error.includes("CORS") || error.includes("origin") ? (
            <Globe className="h-10 w-10" />
          ) : (
            <Bug className="h-10 w-10" />
          )}
          {error}
          
          {(error.includes("Failed to fetch") || error.includes("timeout") || error.includes("timed out")) && (
            <Alert className="mt-2 bg-amber-50">
              <Signal className="h-4 w-4" />
              <AlertTitle>Vấn đề kết nối</AlertTitle>
              <AlertDescription>
                Không thể kết nối đến Edge Function. Điều này có thể do Edge Function tạm thời không khả dụng, timeout quá ngắn, mạng Internet của bạn bị gián đoạn, hoặc CORS không được cấu hình đúng. Thử làm mới trang sau ít phút.
              </AlertDescription>
            </Alert>
          )}

          {(error.includes("CORS") || error.includes("origin")) && (
            <Alert className="mt-2 bg-amber-50">
              <Globe className="h-4 w-4" />
              <AlertTitle>Vấn đề CORS</AlertTitle>
              <AlertDescription>
                Trình duyệt của bạn chặn yêu cầu do các giới hạn CORS. Điều này có thể xảy ra khi truy cập từ nguồn gốc không được ủy quyền. Vui lòng thử truy cập từ URL chính thức.
              </AlertDescription>
            </Alert>
          )}
          
          {debugInfo && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
                className="flex items-center gap-1"
              >
                <Code className="h-4 w-4" />
                {showDebug ? "Ẩn thông tin gỡ lỗi" : "Hiện thông tin gỡ lỗi"}
              </Button>
              
              {showDebug && (
                <div className="mt-3 p-3 bg-zinc-100 border border-zinc-200 rounded-md text-xs font-mono text-left text-zinc-700 whitespace-pre-wrap">
                  {debugInfo}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

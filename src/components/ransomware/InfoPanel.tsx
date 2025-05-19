
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Bug } from "lucide-react";

interface InfoPanelProps {
  isGeoBlocked: boolean;
  error: string | null;
}

export const InfoPanel = ({ isGeoBlocked, error }: InfoPanelProps) => {
  if (!isGeoBlocked && !error) return null;
  
  return (
    <>
      {isGeoBlocked && (
        <Alert variant="destructive" className="mb-6">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Giới Hạn Địa Lý</AlertTitle>
          <AlertDescription>
            Vị trí của bạn bị chặn truy cập vào API ransomware.live. Điều này có thể do các giới hạn cụ thể theo quốc gia được áp dụng bởi nhà cung cấp API.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
          <Bug className="h-10 w-10" />
          {error}
        </div>
      )}
    </>
  );
};

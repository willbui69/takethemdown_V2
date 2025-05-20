
import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const GeoBlockAlert = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Giới Hạn Địa Lý</AlertTitle>
      <AlertDescription>
        Vị trí của bạn bị chặn truy cập vào API ransomware.live. Điều này có thể do các giới hạn cụ thể theo quốc gia được áp dụng bởi nhà cung cấp API.
      </AlertDescription>
    </Alert>
  );
};

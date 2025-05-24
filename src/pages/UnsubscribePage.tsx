
import RootLayout from "@/components/layout/RootLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnsubscribePageHeader } from "@/components/unsubscribe/UnsubscribePageHeader";
import { UnsubscribeStatusContent } from "@/components/unsubscribe/UnsubscribeStatusContent";
import { UnsubscribeActionButtons } from "@/components/unsubscribe/UnsubscribeActionButtons";
import { UnsubscribeContactSection } from "@/components/unsubscribe/UnsubscribeContactSection";
import { useUnsubscribeStatus } from "@/components/unsubscribe/useUnsubscribeStatus";

const UnsubscribePage = () => {
  const { status, email } = useUnsubscribeStatus();
  
  const isSuccess = status === "success" || status === "already-unsubscribed";
  
  const getBorderAndBackgroundClasses = () => {
    switch (status) {
      case "success":
      case "already-unsubscribed":
        return "border-green-200 bg-green-50";
      case "invalid":
      case "not-found":
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-amber-200 bg-amber-50";
    }
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <UnsubscribePageHeader />

          <Card className={`shadow-lg border-2 ${getBorderAndBackgroundClasses()}`}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {status === "success" && "Hủy Đăng Ký Thành Công"}
                {status === "already-unsubscribed" && "Đã Hủy Đăng Ký"}
                {status === "invalid" && "Yêu Cầu Không Hợp Lệ"}
                {status === "not-found" && "Mã Không Hợp Lệ"}
                {status === "error" && "Lỗi Hệ Thống"}
                {status === "loading" && "Đang Xử Lý"}
              </CardTitle>
              <CardDescription className="text-base">
                Quản lý thông báo cảnh báo ransomware
              </CardDescription>
            </CardHeader>
            
            <CardContent className="py-8">
              <UnsubscribeStatusContent status={status} email={email} />
            </CardContent>
            
            <CardContent className="pt-0 pb-8">
              <UnsubscribeActionButtons />
            </CardContent>
          </Card>

          <UnsubscribeContactSection isSuccess={isSuccess} />
        </div>
      </div>
    </RootLayout>
  );
};

export default UnsubscribePage;


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, CircleAlert } from "lucide-react";

const UnsubscribePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "already-unsubscribed" | "error" | "invalid" | "not-found">("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    const emailParam = params.get("email");
    
    if (statusParam) {
      setStatus(statusParam as any);
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    }
  }, [location.search]);

  const getContent = () => {
    switch (status) {
      case "success":
        return {
          icon: <CircleCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />,
          title: "Hủy Đăng Ký Thành Công",
          message: "Bạn đã hủy đăng ký thành công khỏi dịch vụ thông báo ransomware.",
          details: email ? `Email: ${email}` : null,
          extraInfo: "Bạn sẽ không còn nhận được cảnh báo về các nạn nhân ransomware mới. Nếu bạn muốn đăng ký lại trong tương lai, bạn có thể làm điều đó bất cứ lúc nào trên trang giám sát ransomware của chúng tôi."
        };
      
      case "already-unsubscribed":
        return {
          icon: <CircleCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />,
          title: "Đã Hủy Đăng Ký",
          message: "Bạn đã hủy đăng ký nhận thông báo ransomware trước đó.",
          details: email ? `Email: ${email}` : null,
          extraInfo: "Bạn sẽ không nhận được thông báo về ransomware nữa."
        };
      
      case "invalid":
        return {
          icon: <CircleX className="h-16 w-16 text-red-500 mx-auto mb-4" />,
          title: "Yêu Cầu Không Hợp Lệ",
          message: "Không có mã hủy đăng ký được cung cấp trong liên kết này.",
          details: null,
          extraInfo: null
        };
      
      case "not-found":
        return {
          icon: <CircleX className="h-16 w-16 text-red-500 mx-auto mb-4" />,
          title: "Mã Không Hợp Lệ",
          message: "Mã hủy đăng ký không hợp lệ hoặc đã hết hạn.",
          details: null,
          extraInfo: "Nếu bạn vẫn muốn hủy đăng ký, vui lòng liên hệ với chúng tôi."
        };
      
      case "error":
        return {
          icon: <CircleX className="h-16 w-16 text-red-500 mx-auto mb-4" />,
          title: "Lỗi Hệ Thống",
          message: "Đã xảy ra lỗi khi xử lý yêu cầu hủy đăng ký của bạn.",
          details: null,
          extraInfo: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ qua email: lienhe@takethemdown.com.vn"
        };
      
      default:
        return {
          icon: <CircleAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />,
          title: "Đang Xử Lý",
          message: "Đang xử lý yêu cầu hủy đăng ký của bạn...",
          details: null,
          extraInfo: null
        };
    }
  };

  const content = getContent();
  const isSuccess = status === "success" || status === "already-unsubscribed";

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {content.title}
            </CardTitle>
            <CardDescription className="text-center">
              Quản lý thông báo cảnh báo ransomware
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              {content.icon}
              <p className="text-lg mb-4">{content.message}</p>
              
              {content.details && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-w-md">
                  <p className="text-sm text-gray-700 font-medium">{content.details}</p>
                </div>
              )}
              
              {content.extraInfo && (
                <div className={`p-4 rounded-lg mb-6 max-w-md ${isSuccess ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isSuccess ? 'text-blue-800' : 'text-gray-600'}`}>
                    {content.extraInfo}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate("/ransomware")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xem Trang Giám Sát
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Quay Lại Trang Chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
};

export default UnsubscribePage;

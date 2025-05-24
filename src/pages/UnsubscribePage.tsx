
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, CircleAlert, Mail } from "lucide-react";

const UnsubscribePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "already-unsubscribed" | "error" | "invalid" | "not-found">("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    console.log("UnsubscribePage mounted");
    console.log("Current location:", location);
    console.log("Search params:", location.search);
    
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    const emailParam = params.get("email");
    
    console.log("Status param:", statusParam);
    console.log("Email param:", emailParam);
    
    if (statusParam) {
      setStatus(statusParam as any);
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    } else {
      // If no status param, default to invalid
      setStatus("invalid");
    }
  }, [location.search]);

  const getContent = () => {
    switch (status) {
      case "success":
        return {
          icon: <CircleCheck className="h-20 w-20 text-green-500 mx-auto mb-6" />,
          title: "Hủy Đăng Ký Thành Công",
          message: "Bạn đã hủy đăng ký thành công khỏi dịch vụ thông báo ransomware.",
          details: email ? `Email: ${email}` : null,
          extraInfo: "Bạn sẽ không còn nhận được cảnh báo về các nạn nhân ransomware mới. Nếu bạn muốn đăng ký lại trong tương lai, bạn có thể làm điều đó bất cứ lúc nào trên trang giám sát ransomware của chúng tôi.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      
      case "already-unsubscribed":
        return {
          icon: <CircleCheck className="h-20 w-20 text-green-500 mx-auto mb-6" />,
          title: "Đã Hủy Đăng Ký",
          message: "Bạn đã hủy đăng ký nhận thông báo ransomware trước đó.",
          details: email ? `Email: ${email}` : null,
          extraInfo: "Bạn sẽ không nhận được thông báo về ransomware nữa.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      
      case "invalid":
        return {
          icon: <CircleX className="h-20 w-20 text-red-500 mx-auto mb-6" />,
          title: "Yêu Cầu Không Hợp Lệ",
          message: "Không có mã hủy đăng ký được cung cấp trong liên kết này.",
          details: null,
          extraInfo: "Vui lòng sử dụng liên kết hủy đăng ký từ email thông báo của chúng tôi.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      
      case "not-found":
        return {
          icon: <CircleX className="h-20 w-20 text-red-500 mx-auto mb-6" />,
          title: "Mã Không Hợp Lệ",
          message: "Mã hủy đăng ký không hợp lệ hoặc đã hết hạn.",
          details: null,
          extraInfo: "Nếu bạn vẫn muốn hủy đăng ký, vui lòng liên hệ với chúng tôi qua email: lienhe@takethemdown.com.vn",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      
      case "error":
        return {
          icon: <CircleX className="h-20 w-20 text-red-500 mx-auto mb-6" />,
          title: "Lỗi Hệ Thống",
          message: "Đã xảy ra lỗi khi xử lý yêu cầu hủy đăng ký của bạn.",
          details: null,
          extraInfo: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ qua email: lienhe@takethemdown.com.vn",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      
      default:
        return {
          icon: <CircleAlert className="h-20 w-20 text-amber-500 mx-auto mb-6 animate-pulse" />,
          title: "Đang Xử Lý",
          message: "Đang xử lý yêu cầu hủy đăng ký của bạn...",
          details: null,
          extraInfo: null,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200"
        };
    }
  };

  const content = getContent();
  const isSuccess = status === "success" || status === "already-unsubscribed";

  return (
    <RootLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <Mail className="h-16 w-16 text-security mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản Lý Đăng Ký Email
            </h1>
            <p className="text-gray-600">
              Dịch vụ cảnh báo ransomware TakeThemDown
            </p>
          </div>

          <Card className={`shadow-lg ${content.borderColor} border-2 ${content.bgColor || ''}`}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {content.title}
              </CardTitle>
              <CardDescription className="text-base">
                Quản lý thông báo cảnh báo ransomware
              </CardDescription>
            </CardHeader>
            
            <CardContent className="py-8">
              <div className="text-center">
                {content.icon}
                
                <div className="max-w-md mx-auto">
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {content.message}
                  </p>
                  
                  {content.details && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                      <p className="text-sm text-gray-700 font-medium flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        {content.details}
                      </p>
                    </div>
                  )}
                  
                  {content.extraInfo && (
                    <div className={`p-4 rounded-lg mb-8 ${
                      isSuccess 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}>
                      <p className={`text-sm leading-relaxed ${
                        isSuccess ? 'text-blue-800' : 'text-gray-700'
                      }`}>
                        {content.extraInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardContent className="pt-0 pb-8">
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
            </CardContent>
          </Card>

          {isSuccess && (
            <div className="mt-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cần hỗ trợ thêm?
                </h3>
                <p className="text-gray-600 mb-4">
                  Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi.
                </p>
                <a 
                  href="mailto:lienhe@takethemdown.com.vn"
                  className="text-security hover:text-security-light font-medium underline"
                >
                  lienhe@takethemdown.com.vn
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
};

export default UnsubscribePage;

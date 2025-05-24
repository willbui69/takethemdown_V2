
import { ReactNode } from "react";
import { CircleCheck, CircleX, CircleAlert, Mail } from "lucide-react";

interface StatusContentConfig {
  icon: ReactNode;
  title: string;
  message: string;
  details: string | null;
  extraInfo: string | null;
  bgColor: string;
  borderColor: string;
}

interface UnsubscribeStatusContentProps {
  status: "loading" | "success" | "already-unsubscribed" | "error" | "invalid" | "not-found";
  email: string;
}

export const UnsubscribeStatusContent = ({ status, email }: UnsubscribeStatusContentProps) => {
  const getContent = (): StatusContentConfig => {
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
  );
};

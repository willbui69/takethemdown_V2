
import { Mail } from "lucide-react";

export const UnsubscribePageHeader = () => {
  return (
    <div className="text-center mb-8">
      <Mail className="h-16 w-16 text-security mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Quản Lý Đăng Ký Email
      </h1>
      <p className="text-gray-600">
        Dịch vụ cảnh báo ransomware TakeThemDown
      </p>
    </div>
  );
};

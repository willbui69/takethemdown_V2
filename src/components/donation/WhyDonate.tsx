
import { Shield, Coffee, Users } from "lucide-react";

const WhyDonate = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Tại sao hỗ trợ chúng tôi?
      </h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-security/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-security" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Bảo vệ cộng đồng</h3>
            <p className="text-gray-600">
              Chúng tôi làm việc không mệt mỏi để bảo vệ người dân Việt Nam khỏi các cuộc tấn công mạng và lừa đảo trực tuyến.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-security/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Coffee className="h-5 w-5 text-security" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Duy trì hoạt động</h3>
            <p className="text-gray-600">
              Sự đóng góp của bạn giúp chúng tôi duy trì máy chủ, công cụ và nguồn lực cần thiết để tiếp tục sứ mệnh.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-security/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-security" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Hoàn toàn miễn phí</h3>
            <p className="text-gray-600">
              Tất cả dịch vụ của chúng tôi hoàn toàn miễn phí cho người dùng. Chúng tôi không bao giờ tính phí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyDonate;

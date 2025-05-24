
import { Globe, UserX, Lock, Search, AlertTriangle, FileSearch } from "lucide-react";
import AnimatedElement from "../utils/AnimatedElement";

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedElement className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Dịch Vụ Hỗ Trợ</h2>
          <p className="text-gray-600">
            Chúng tôi cung cấp các dịch vụ hỗ trợ chuyên nghiệp giúp bảo vệ bạn và 
            doanh nghiệp của bạn khỏi các mối đe dọa mạng.
          </p>
        </AnimatedElement>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <Globe className="h-10 w-10 text-security mb-4" />
            <h3 className="font-bold text-xl mb-2">Gỡ Bỏ Website Giả Mạo</h3>
            <p className="text-gray-600">
              Hỗ trợ xác minh và gỡ bỏ các website giả mạo thương hiệu, tổ chức hoặc 
              cá nhân của bạn trên internet.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <UserX className="h-10 w-10 text-security mb-4" />
            <h3 className="font-bold text-xl mb-2">Xóa Tài Khoản Mạo Danh</h3>
            <p className="text-gray-600">
              Hỗ trợ báo cáo và yêu cầu xóa các tài khoản mạng xã hội mạo danh 
              bạn hoặc tổ chức của bạn.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <Search className="h-10 w-10 text-security mb-4" />
            <h3 className="font-bold text-xl mb-2">Kiểm Tra Rò Rỉ Thông Tin</h3>
            <p className="text-gray-600">
              Kiểm tra và xác minh thông tin của bạn có bị rò rỉ trên internet hoặc 
              dark web hay không.
            </p>
          </div>
          
          <AnimatedElement className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <Lock className="h-10 w-10 text-security mb-4" />
            <h3 className="font-bold text-xl mb-2">Hỗ Trợ Lộ Mật Khẩu</h3>
            <p className="text-gray-600">
              Hướng dẫn các bước cần thực hiện khi mật khẩu của bạn bị lộ 
              hoặc tài khoản bị xâm nhập.
            </p>
          </AnimatedElement>
          
          <AnimatedElement className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <AlertTriangle className="h-10 w-10 text-security mb-4" />
            <h3 className="font-bold text-xl mb-2">Cảnh Báo Ransomware</h3>
            <p className="text-gray-600">
              Theo dõi và cảnh báo về các nạn nhân ransomware mới, cung cấp thông tin 
              cập nhật về các cuộc tấn công ransomware.
            </p>
          </AnimatedElement>

          <AnimatedElement className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <FileSearch className="h-10 w-10 text-security mb-4" />
            <h3 className="font-bold text-xl mb-2">Điều Tra</h3>
            <p className="text-gray-600">
              Dịch vụ điều tra chuyên sâu và hỗ trợ khôi phục sau tấn công ransomware, 
              phân tích mối đe dọa mạng.
            </p>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

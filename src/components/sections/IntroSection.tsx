
import { Heart, Shield, Users } from "lucide-react";
import AnimatedElement from "../utils/AnimatedElement";

const IntroSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedElement className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Về Dự Án Của Chúng Tôi</h2>
          <p className="text-gray-600">
            Take Them Down là dự án phi lợi nhuận, được tạo ra với sứ mệnh bảo vệ người dùng 
            internet và doanh nghiệp Việt Nam khỏi các mối đe dọa trên không gian mạng.
          </p>
        </AnimatedElement>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedElement className="bg-gray-50 p-6 rounded-lg text-center section-animate">
            <div className="bg-security-light inline-block p-3 rounded-full text-white mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl mb-2">Vì Cộng Đồng</h3>
            <p className="text-gray-600">
              Chúng tôi hoạt động với tinh thần cộng đồng, không vì lợi nhuận, 
              nhằm xây dựng một môi trường mạng an toàn cho người Việt.
            </p>
          </AnimatedElement>
          
          <AnimatedElement className="bg-gray-50 p-6 rounded-lg text-center section-animate">
            <div className="bg-security-light inline-block p-3 rounded-full text-white mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl mb-2">Bảo Vệ Danh Tính</h3>
            <p className="text-gray-600">
              Chúng tôi giúp bảo vệ danh tính cá nhân và thương hiệu của bạn khỏi 
              các hoạt động giả mạo và lừa đảo trên mạng.
            </p>
          </AnimatedElement>
          
          <AnimatedElement className="bg-gray-50 p-6 rounded-lg text-center section-animate">
            <div className="bg-security-light inline-block p-3 rounded-full text-white mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl mb-2">Mạng Lưới Chuyên Gia</h3>
            <p className="text-gray-600">
              Dự án quy tụ các chuyên gia bảo mật và an toàn thông tin, sẵn sàng 
              hỗ trợ giải quyết các vấn đề về an ninh mạng.
            </p>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;

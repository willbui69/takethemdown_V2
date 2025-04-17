
import { ClipboardCheck, FileSearch, Shield, MessageCircle } from "lucide-react";
import AnimatedElement from "../utils/AnimatedElement";

const ProcessSection = () => {
  return (
    <section id="process" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedElement className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Quy Trình Hỗ Trợ</h2>
          <p className="text-gray-600">
            Quy trình hỗ trợ đơn giản và hiệu quả của chúng tôi giúp bạn 
            nhanh chóng nhận được sự trợ giúp cần thiết.
          </p>
        </AnimatedElement>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg relative border border-gray-100">
            <div className="absolute -top-4 -left-4 bg-security text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">1</div>
            <div className="flex flex-col items-center text-center pt-6">
              <ClipboardCheck className="h-12 w-12 text-security mb-4" />
              <h3 className="font-bold text-xl mb-2">Gửi Yêu Cầu</h3>
              <p className="text-gray-600">
                Điền thông tin vào biểu mẫu và gửi yêu cầu hỗ trợ của bạn 
                đến đội ngũ chuyên gia của chúng tôi.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg relative border border-gray-100">
            <div className="absolute -top-4 -left-4 bg-security text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">2</div>
            <div className="flex flex-col items-center text-center pt-6">
              <FileSearch className="h-12 w-12 text-security mb-4" />
              <h3 className="font-bold text-xl mb-2">Kiểm Tra Xác Minh</h3>
              <p className="text-gray-600">
                Chúng tôi xác minh thông tin và đánh giá mức độ nghiêm trọng 
                của vấn đề để lên kế hoạch xử lý.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg relative border border-gray-100">
            <div className="absolute -top-4 -left-4 bg-security text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">3</div>
            <div className="flex flex-col items-center text-center pt-6">
              <Shield className="h-12 w-12 text-security mb-4" />
              <h3 className="font-bold text-xl mb-2">Tiến Hành Xử Lý</h3>
              <p className="text-gray-600">
                Chúng tôi tiến hành các biện pháp cần thiết để giải quyết 
                vấn đề của bạn một cách hiệu quả.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg relative border border-gray-100">
            <div className="absolute -top-4 -left-4 bg-security text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">4</div>
            <div className="flex flex-col items-center text-center pt-6">
              <MessageCircle className="h-12 w-12 text-security mb-4" />
              <h3 className="font-bold text-xl mb-2">Phản Hồi Kết Quả</h3>
              <p className="text-gray-600">
                Bạn sẽ nhận được báo cáo về kết quả xử lý và các khuyến nghị 
                bổ sung để bảo vệ tốt hơn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

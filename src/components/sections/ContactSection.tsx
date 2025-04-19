import { Mail, Phone, Facebook } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Liên Hệ Hỗ Trợ</h2>
          <p className="text-gray-600">
            Gửi yêu cầu hỗ trợ hoặc liên hệ với chúng tôi qua các kênh dưới đây.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold mb-4">Gửi yêu cầu hỗ trợ</h3>
              <iframe 
                id="jotform-iframe"
                title="Biểu mẫu yêu cầu hỗ trợ"
                className="w-full h-[500px] border-0"
                src="https://submit.jotform.com/251084322682454"
              >
                Loading...
              </iframe>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Thông tin liên hệ</h3>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-5 w-5 text-security" />
                <a href="mailto:takethemdown.help@gmail.com" className="text-gray-700 hover:text-security">
                  takethemdown.help@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Facebook className="h-5 w-5 text-security" />
                <a 
                  href="https://www.facebook.com/takethemdown.vn/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-700 hover:text-security"
                >
                  Facebook Page
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-security" />
                <span className="text-gray-700">Chỉ tiếp nhận qua email và form</span>
              </div>
            </div>
            
            <div className="bg-security text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Trường hợp khẩn cấp</h3>
              <p className="mb-4">
                Đối với các trường hợp khẩn cấp như lộ thông tin nhạy cảm hoặc tài khoản 
                quan trọng bị xâm nhập, vui lòng ghi rõ "KHẨN CẤP" trong tiêu đề email.
              </p>
              <p>
                Chúng tôi sẽ ưu tiên xử lý các trường hợp này trong thời gian sớm nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

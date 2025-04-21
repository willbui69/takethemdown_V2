
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FaqSection = () => {
  const faqs: FaqItem[] = [
    {
      question: "Dịch vụ có miễn phí không?",
      answer: "Có, tất cả dịch vụ của Take Them Down đều được cung cấp miễn phí. Chúng tôi là dự án phi lợi nhuận hoạt động với mục tiêu vì cộng đồng, giúp bảo vệ không gian mạng Việt Nam được an toàn hơn."
    },
    {
      question: "Có đảm bảo bảo mật thông tin không?",
      answer: "Tuyệt đối. Chúng tôi coi trọng việc bảo mật thông tin của người dùng và tuân thủ nghiêm ngặt các chính sách bảo mật. Thông tin của bạn chỉ được sử dụng để giải quyết vấn đề bạn gặp phải và sẽ không được chia sẻ với bên thứ ba."
    },
    {
      question: "Mất bao lâu để xử lý yêu cầu?",
      answer: "Thời gian xử lý phụ thuộc vào độ phức tạp của vấn đề. Thông thường, chúng tôi phản hồi ban đầu trong vòng 24-48 giờ. Đối với các vấn đề đơn giản, có thể được giải quyết trong vài ngày, trong khi các vấn đề phức tạp hơn có thể mất từ 1-2 tuần."
    },
    {
      question: "Làm thế nào để biết thông tin của tôi có bị rò rỉ không?",
      answer: "Chúng tôi sử dụng các công cụ và cơ sở dữ liệu chuyên biệt để kiểm tra xem thông tin của bạn có xuất hiện trong các vụ rò rỉ dữ liệu đã biết không. Khi bạn gửi yêu cầu kiểm tra, chúng tôi sẽ thông báo kết quả và hướng dẫn các biện pháp bảo vệ nếu phát hiện thông tin của bạn đã bị lộ."
    },
    {
      question: "Các biện pháp phòng ngừa giả mạo là gì?",
      answer: "Để phòng ngừa giả mạo, bạn nên thường xuyên thay đổi mật khẩu, sử dụng xác thực hai yếu tố, giám sát các tài khoản trực tuyến của mình, kiểm tra cài đặt quyền riêng tư và hạn chế chia sẻ thông tin cá nhân trên mạng xã hội. Chúng tôi cũng cung cấp hướng dẫn chi tiết về các biện pháp bảo vệ cụ thể."
    },
    {
      question: "Làm thế nào để báo cáo trang web giả mạo?",
      answer: "Để báo cáo trang web giả mạo, bạn có thể điền thông tin vào biểu mẫu trên trang web của chúng tôi, cung cấp URL của trang web giả mạo, mô tả về nội dung giả mạo và cung cấp bằng chứng về quyền sở hữu thương hiệu hoặc danh tính của bạn (nếu bạn là bên bị giả mạo)."
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Câu Hỏi Thường Gặp</h2>
          <p className="text-gray-600">
            Tìm hiểu thêm về dịch vụ của chúng tôi qua những câu hỏi thường gặp.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border-b border-gray-200 py-4"
            >
              <button 
                className="flex justify-between items-center w-full text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-security" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="mt-2 text-gray-600 pl-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;


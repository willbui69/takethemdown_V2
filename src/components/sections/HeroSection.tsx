
import { ArrowRight } from "lucide-react";
import AnimatedElement from "../utils/AnimatedElement";

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-r from-security to-security-light text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedElement className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Ngăn chặn mối đe dọa mạng. Bảo vệ bạn và doanh nghiệp.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Dự án phi lợi nhuận hỗ trợ cộng đồng Việt Nam ngăn chặn giả mạo, 
            bảo vệ danh tính và đảm bảo an toàn thông tin trên không gian mạng.
          </p>
          <button 
            onClick={scrollToContact}
            className="bg-white text-security hover:bg-gray-100 transition-colors px-6 py-3 rounded-md font-medium flex items-center gap-2"
          >
            Gửi yêu cầu hỗ trợ
            <ArrowRight className="h-5 w-5" />
          </button>
        </AnimatedElement>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
    </section>
  );
};

export default HeroSection;

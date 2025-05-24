
import { Heart, Shield, Users } from "lucide-react";

const DonationHero = () => {
  return (
    <section className="bg-security text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-red-300" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hỗ Trợ Take Them Down
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Giúp chúng tôi bảo vệ cộng đồng khỏi các mối đe dọa an ninh mạng
          </p>
          <div className="flex items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Dự án phi lợi nhuận</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Phục vụ cộng đồng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationHero;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Coffee, Shield, Users, CheckCircle } from "lucide-react";
import { useState } from "react";

const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000]; // VND amounts
  
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDonation = (amount: number) => {
    // This would integrate with a payment processor in a real implementation
    console.log(`Processing donation of ${formatVND(amount)}`);
    alert(`Cảm ơn bạn đã quyên góp ${formatVND(amount)}! Tính năng thanh toán sẽ được tích hợp sớm.`);
  };

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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

      {/* Donation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Why donate */}
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

              {/* Right side - Donation form */}
              <div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Quyên góp
                    </CardTitle>
                    <CardDescription>
                      Chọn số tiền bạn muốn đóng góp để hỗ trợ dự án
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Predefined amounts */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chọn số tiền:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                            }}
                            className={`p-3 rounded-lg border text-center transition-colors ${
                              selectedAmount === amount
                                ? "border-security bg-security/10 text-security font-semibold"
                                : "border-gray-200 hover:border-security/50 hover:bg-gray-50"
                            }`}
                          >
                            {formatVND(amount)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hoặc nhập số tiền khác:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          placeholder="Nhập số tiền (VND)"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-security/20 focus:border-security"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">VND</span>
                      </div>
                    </div>

                    {/* Donation button */}
                    <Button
                      onClick={() => handleDonation(finalAmount)}
                      disabled={!finalAmount || finalAmount <= 0}
                      className="w-full bg-security hover:bg-security-light text-white py-3 text-lg"
                      size="lg"
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      {finalAmount > 0 ? `Quyên góp ${formatVND(finalAmount)}` : "Quyên góp"}
                    </Button>

                    {/* Security note */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <p className="font-medium mb-1">An toàn & bảo mật</p>
                          <p>Tất cả giao dịch được mã hóa và xử lý an toàn. Chúng tôi không lưu trữ thông tin thẻ của bạn.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Alternative ways to support */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Các cách khác để hỗ trợ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-security" />
                      <span className="text-sm">Chia sẻ trang web với bạn bè</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-5 w-5 text-security" />
                      <span className="text-sm">Báo cáo các trang web lừa đảo</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Coffee className="h-5 w-5 text-security" />
                      <span className="text-sm">Tham gia cộng đồng tình nguyện</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonationSection;

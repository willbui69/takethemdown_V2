
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle } from "lucide-react";
import { useState } from "react";
import PaymentMethods from "./PaymentMethods";

const DonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000]; // VND amounts
  
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDonation = (amount: number) => {
    if (amount > 0) {
      setShowPaymentMethods(true);
    }
  };

  const handlePaymentMethod = (method: string) => {
    const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
    console.log(`Processing donation of ${formatVND(finalAmount)} via ${method}`);
    alert(`Chuyển hướng đến ${method} để thanh toán ${formatVND(finalAmount)}. Tính năng thanh toán sẽ được tích hợp sớm.`);
  };

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  return (
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
        {!showPaymentMethods ? (
          <>
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
          </>
        ) : (
          <PaymentMethods
            finalAmount={finalAmount}
            formatVND={formatVND}
            onPaymentMethod={handlePaymentMethod}
            onBack={() => setShowPaymentMethods(false)}
          />
        )}

        {/* Security note */}
        {!showPaymentMethods && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">An toàn & bảo mật</p>
                <p>Tất cả giao dịch được mã hóa và xử lý an toàn. Chúng tôi không lưu trữ thông tin thẻ của bạn.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationForm;

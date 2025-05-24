
import { Button } from "@/components/ui/button";
import { Smartphone, CreditCard, Building } from "lucide-react";
import { useState } from "react";
import QRCodeDisplay from "./QRCodeDisplay";

interface PaymentMethodsProps {
  finalAmount: number;
  formatVND: (amount: number) => string;
  onPaymentMethod: (method: string) => void;
  onBack: () => void;
}

const PaymentMethods = ({ finalAmount, formatVND, onPaymentMethod, onBack }: PaymentMethodsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  if (selectedMethod) {
    return (
      <QRCodeDisplay
        paymentMethod={selectedMethod}
        amount={finalAmount}
        onBack={() => setSelectedMethod(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Chọn phương thức thanh toán
        </h3>
        <p className="text-sm text-gray-600">
          Số tiền: <span className="font-semibold text-security">{formatVND(finalAmount)}</span>
        </p>
      </div>

      <div className="space-y-3">
        {/* Momo */}
        <button
          onClick={() => handleMethodSelect("Momo")}
          className="w-full p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Ví MoMo</div>
            <div className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</div>
          </div>
        </button>

        {/* VNPay */}
        <button
          onClick={() => handleMethodSelect("VNPay")}
          className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">VNPay</div>
            <div className="text-sm text-gray-500">Thanh toán qua thẻ ATM/Visa/Mastercard</div>
          </div>
        </button>

        {/* Banking */}
        <button
          onClick={() => handleMethodSelect("Chuyển khoản ngân hàng")}
          className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Chuyển khoản ngân hàng</div>
            <div className="text-sm text-gray-500">Chuyển khoản trực tiếp qua ngân hàng</div>
          </div>
        </button>
      </div>

      {/* Back button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="w-full mt-4"
      >
        Quay lại
      </Button>
    </div>
  );
};

export default PaymentMethods;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface QRCodeDisplayProps {
  paymentMethod: string;
  amount: number;
  onBack: () => void;
}

const QRCodeDisplay = ({ paymentMethod, amount, onBack }: QRCodeDisplayProps) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [paymentMethod, amount]);

  const generateQRCode = async () => {
    setIsLoading(true);
    let qrData = "";
    let info = "";

    switch (paymentMethod) {
      case "Momo":
        qrData = `2|99|${amount}|Take Them Down Donation|0363123456`;
        info = "Số điện thoại: 0363123456\nNội dung: Take Them Down Donation";
        break;
      case "VNPay":
        qrData = `https://qr.vnpay.vn/payment?amount=${amount}&description=Take%20Them%20Down%20Donation`;
        info = "Quét mã QR để thanh toán qua VNPay";
        break;
      case "Chuyển khoản ngân hàng":
        qrData = `970422|1234567890|NGUYEN VAN A|${amount}|Take Them Down Donation`;
        info = "Ngân hàng: Sacombank (970422)\nSố tài khoản: 1234567890\nChủ tài khoản: NGUYEN VAN A\nNội dung: Take Them Down Donation";
        break;
      default:
        qrData = `Donation: ${amount} VND for Take Them Down`;
        info = "Thông tin thanh toán";
    }

    setPaymentInfo(info);

    try {
      // Dynamically import qrcode to avoid build issues
      const QRCode = await import('qrcode');
      const qrCodeURL = await QRCode.default.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrCodeDataURL(qrCodeURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentInfo);
      alert("Đã sao chép thông tin thanh toán!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Không thể sao chép. Vui lòng copy thủ công.");
    }
  };

  const downloadQR = () => {
    if (!qrCodeDataURL) return;
    
    const link = document.createElement("a");
    link.download = `${paymentMethod}-QR-${amount}VND.png`;
    link.href = qrCodeDataURL;
    link.click();
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-600">
          {paymentMethod} - <span className="font-semibold text-security">{formatVND(amount)}</span>
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {isLoading ? (
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Đang tạo mã QR...</span>
            </div>
          ) : qrCodeDataURL ? (
            <img src={qrCodeDataURL} alt="QR Code" className="w-64 h-64" />
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Không thể tạo mã QR</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Thông tin thanh toán:</h4>
        <pre className="text-sm text-gray-600 whitespace-pre-line font-mono">
          {paymentInfo}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Sao chép thông tin
          </Button>
          <Button
            onClick={downloadQR}
            variant="outline"
            className="flex-1"
            disabled={!qrCodeDataURL || isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Tải mã QR
          </Button>
        </div>
        
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full"
        >
          Quay lại
        </Button>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Lưu ý:</strong> Sau khi thanh toán thành công, vui lòng chụp ảnh màn hình để làm bằng chứng. 
          Chúng tôi sẽ xác nhận và gửi email cảm ơn trong vòng 24 giờ.
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;

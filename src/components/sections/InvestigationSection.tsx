
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileSearch, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvestigationSection = () => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/#contact");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-security text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trung Tâm Điều Tra
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Báo cáo các trường hợp đáng nghi và theo dõi tiến độ điều tra của chúng tôi
            </p>
            <Button 
              onClick={handleReportClick}
              size="lg"
              className="bg-white text-security hover:bg-gray-100"
            >
              <FileSearch className="mr-2 h-5 w-5" />
              Gửi Báo Cáo Điều Tra
            </Button>
          </div>
        </div>
      </section>

      {/* Under Development Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-orange-200 bg-orange-50">
              <Construction className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800 text-lg">
                <strong>Thông báo:</strong> Chúng tôi đang phát triển trang này. Vui lòng quay lại sau để xem các tính năng mới!
              </AlertDescription>
            </Alert>
            
            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12">
                <Construction className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Đang trong quá trình phát triển
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Trung tâm điều tra của Take Them Down sẽ sớm cung cấp các tính năng:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="bg-security/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FileSearch className="h-4 w-4 text-security" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Theo dõi vụ việc</h3>
                      <p className="text-sm text-gray-600">Xem tiến độ điều tra các báo cáo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-security/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FileSearch className="h-4 w-4 text-security" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Báo cáo điều tra</h3>
                      <p className="text-sm text-gray-600">Đọc các báo cáo hoàn thành</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button 
                    onClick={handleReportClick}
                    className="bg-security text-white hover:bg-security-light"
                  >
                    <FileSearch className="mr-2 h-4 w-4" />
                    Gửi báo cáo ngay bây giờ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestigationSection;

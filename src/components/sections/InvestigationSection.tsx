
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSearch, Calendar, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvestigationSection = () => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/#contact");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Sample investigation cases
  const cases = [
    {
      id: "INV-2024-001",
      title: "Mạng lưới giả mạo ngân hàng quy mô lớn",
      description: "Điều tra về mạng lưới website giả mạo các ngân hàng lớn tại Việt Nam nhằm đánh cắp thông tin tài khoản người dùng.",
      status: "Đang điều tra",
      date: "15/05/2024",
      investigator: "Nhóm An ninh mạng",
      category: "Lừa đảo tài chính"
    },
    {
      id: "INV-2024-002", 
      title: "Chiến dịch phishing qua email giả mạo cơ quan nhà nước",
      description: "Phân tích và truy vết nguồn gốc các email giả mạo cơ quan thuế và bảo hiểm xã hội.",
      status: "Hoàn thành",
      date: "08/05/2024",
      investigator: "Nhóm Phân tích",
      category: "Phishing"
    },
    {
      id: "INV-2024-003",
      title: "Tài khoản mạng xã hội giả mạo người nổi tiếng",
      description: "Điều tra về các tài khoản Facebook và Instagram giả mạo nghệ sĩ Việt Nam để lừa đảo fan hâm mộ.",
      status: "Đang xử lý",
      date: "12/05/2024", 
      investigator: "Nhóm Mạng xã hội",
      category: "Giả mạo danh tính"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang điều tra":
        return "bg-blue-100 text-blue-800";
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-4">Về Trung Tâm Điều Tra</h2>
              <p className="text-gray-600 mb-4">
                Trung tâm điều tra của Take Them Down chuyên nghiên cứu và phân tích các vụ việc 
                an ninh mạng phức tạp. Chúng tôi điều tra các mạng lưới lừa đảo, giả mạo và các 
                hoạt động tội phạm mạng nhằm bảo vệ cộng đồng Việt Nam.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-security/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FileSearch className="h-8 w-8 text-security" />
                  </div>
                  <h3 className="font-semibold mb-2">Điều Tra Chuyên Sâu</h3>
                  <p className="text-sm text-gray-600">
                    Phân tích kỹ thuật và truy vết nguồn gốc các mối đe dọa
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-security/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-security" />
                  </div>
                  <h3 className="font-semibold mb-2">Nhóm Chuyên Gia</h3>
                  <p className="text-sm text-gray-600">
                    Đội ngũ chuyên gia an ninh mạng giàu kinh nghiệm
                  </p>
                </div>
                <div className="bg-security/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-security" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Hành Động Nhanh</h3>
                  <p className="text-sm text-gray-600">
                    Phản hồi và xử lý các báo cáo trong thời gian ngắn nhất
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Investigation Cases */}
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Các Vụ Điều Tra Gần Đây</h2>
              <Button 
                onClick={handleReportClick}
                variant="outline"
              >
                <FileSearch className="mr-2 h-4 w-4" />
                Báo Cáo Vụ Việc Mới
              </Button>
            </div>

            <div className="grid gap-6">
              {cases.map((case_item) => (
                <Card key={case_item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{case_item.title}</CardTitle>
                        <CardDescription className="mt-2">
                          ID: {case_item.id}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(case_item.status)}>
                        {case_item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{case_item.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Ngày: {case_item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Điều tra: {case_item.investigator}</span>
                      </div>
                      <div>
                        <Badge variant="outline">{case_item.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-security text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Phát Hiện Hoạt Động Đáng Nghi?</h3>
              <p className="mb-6 opacity-90">
                Nếu bạn phát hiện các website giả mạo, email lừa đảo, hoặc bất kỳ hoạt động 
                tội phạm mạng nào, hãy báo cáo ngay cho chúng tôi để được điều tra và xử lý.
              </p>
              <Button 
                onClick={handleReportClick}
                size="lg"
                className="bg-white text-security hover:bg-gray-100"
              >
                Gửi Báo Cáo Ngay
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestigationSection;

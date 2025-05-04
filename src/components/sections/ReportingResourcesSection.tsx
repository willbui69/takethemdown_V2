
import { Shield, Building, Flag, Mail, Phone } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceLink {
  name: string;
  url?: string;
  email?: string;
  phone?: string;
  description: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  resources: ResourceLink[];
}

const ReportingResourcesSection = () => {
  // This will be replaced with the actual resources once provided
  const resourceCategories: ResourceCategory[] = [
    {
      id: "law-enforcement",
      title: "Cơ quan thực thi pháp luật",
      icon: <Shield className="h-8 w-8 text-security" />,
      description: "Các cơ quan chức năng có trách nhiệm điều tra và xử lý các vụ việc lừa đảo trực tuyến.",
      resources: [
        {
          name: "Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05)",
          url: "http://bocongan.gov.vn",
          email: "phongchongtoiphamcongnghecao@mps.gov.vn",
          description: "Cơ quan chuyên trách về phòng chống tội phạm công nghệ cao thuộc Bộ Công an."
        },
        {
          name: "Cục An toàn thông tin (Bộ Thông tin và Truyền thông)",
          url: "https://www.ais.gov.vn/",
          email: "thongbao@ais.gov.vn",
          description: "Cơ quan quản lý nhà nước về an toàn thông tin."
        }
      ]
    },
    {
      id: "platform-reporting",
      title: "Báo cáo trực tiếp tới các nền tảng",
      icon: <Flag className="h-8 w-8 text-security" />,
      description: "Hầu hết các nền tảng mạng xã hội và các trang web đều có công cụ báo cáo nội dung vi phạm.",
      resources: [
        {
          name: "Facebook",
          url: "https://www.facebook.com/help/reportlinks",
          description: "Báo cáo nội dung lừa đảo, giả mạo hoặc spam trên Facebook."
        },
        {
          name: "Google",
          url: "https://safebrowsing.google.com/safebrowsing/report_phish/",
          description: "Báo cáo trang web lừa đảo hoặc phishing trên Google."
        }
      ]
    },
    {
      id: "support-organizations",
      title: "Tổ chức hỗ trợ",
      icon: <Building className="h-8 w-8 text-security" />,
      description: "Các tổ chức phi lợi nhuận và dịch vụ hỗ trợ nạn nhân bị lừa đảo trực tuyến.",
      resources: [
        {
          name: "Take Them Down",
          url: "https://takethemdown.vn",
          email: "takethemdown.help@gmail.com",
          description: "Dự án phi lợi nhuận hỗ trợ nạn nhân bị lừa đảo trực tuyến tại Việt Nam."
        }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Hướng Dẫn Báo Cáo</h1>
          <p className="text-gray-600">
            Trang này cung cấp thông tin về cách báo cáo các hoạt động lừa đảo trực tuyến đến các cơ quan chức năng và tổ chức có trách nhiệm.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Khi nào nên báo cáo?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Gặp trang web lừa đảo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nếu bạn phát hiện trang web giả mạo các tổ chức tài chính, doanh nghiệp hoặc cá nhân với mục đích lừa đảo.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bị mất tiền hoặc thông tin</CardTitle>  
              </CardHeader>
              <CardContent>
                <p>Nếu bạn đã trở thành nạn nhân của lừa đảo, mất tiền hoặc thông tin cá nhân nhạy cảm.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bị giả mạo danh tính</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nếu ai đó đang giả mạo bạn hoặc tổ chức của bạn trên mạng xã hội hoặc các nền tảng trực tuyến.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Các bước báo cáo hiệu quả</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <span className="font-medium">Thu thập bằng chứng</span>: Chụp màn hình, lưu URL, tin nhắn và mọi thông tin liên quan.
              </li>
              <li>
                <span className="font-medium">Ghi lại thời gian</span>: Ghi chú thời gian xảy ra sự việc và các chi tiết quan trọng.
              </li>
              <li>
                <span className="font-medium">Liên hệ cơ quan có thẩm quyền</span>: Báo cáo cho các cơ quan thực thi pháp luật hoặc tổ chức liên quan.
              </li>
              <li>
                <span className="font-medium">Báo cáo trên nền tảng</span>: Sử dụng công cụ báo cáo của nền tảng nơi xảy ra vi phạm.
              </li>
              <li>
                <span className="font-medium">Đề phòng thiệt hại</span>: Thay đổi mật khẩu, thông báo cho ngân hàng nếu liên quan đến tài chính.
              </li>
            </ol>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Nguồn lực báo cáo</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {resourceCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    {category.icon}
                    <span className="ml-3">{category.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4 text-gray-600">{category.description}</p>
                  
                  <div className="space-y-4">
                    {category.resources.map((resource, index) => (
                      <div key={index} className="p-4 bg-white border border-gray-200 rounded-md">
                        <h4 className="font-medium mb-2">{resource.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        
                        <div className="mt-2 space-y-1">
                          {resource.url && (
                            <div className="flex items-center text-sm">
                              <Flag className="h-4 w-4 text-security mr-2" />
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-security hover:underline"
                              >
                                {resource.url}
                              </a>
                            </div>
                          )}
                          
                          {resource.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 text-security mr-2" />
                              <a 
                                href={`mailto:${resource.email}`} 
                                className="text-security hover:underline"
                              >
                                {resource.email}
                              </a>
                            </div>
                          )}
                          
                          {resource.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-4 w-4 text-security mr-2" />
                              <a 
                                href={`tel:${resource.phone}`} 
                                className="text-security hover:underline"
                              >
                                {resource.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-security/10 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Liên hệ Take Them Down</h3>
          <p className="mb-4">
            Nếu bạn cần hỗ trợ thêm trong quá trình báo cáo, đội ngũ của Take Them Down luôn sẵn sàng giúp đỡ bạn. 
            Chúng tôi có thể hướng dẫn quy trình báo cáo và cung cấp thông tin về các nguồn lực phù hợp.
          </p>
          <a 
            href="/#contact" 
            className="inline-flex items-center bg-security text-white px-4 py-2 rounded-md hover:bg-security-light transition-colors"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReportingResourcesSection;

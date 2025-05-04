
import { Shield, Building, Flag, Mail, Phone, Globe } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface CountryContact {
  country: string;
  phone: string;
  email: string;
  reportLink: string;
}

const ReportingResourcesSection = () => {
  // Original resource categories
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
          description: "Dự án phi lợi nhuận hỗ trợ nạn nhân bị lừa đảo trực tuyến tại Việt Nam."
        }
      ]
    }
  ];

  // International reporting contacts
  const asianContacts: CountryContact[] = [
    { country: "China", phone: "110 (police) / 96110", email: "-", reportLink: "- (Báo cáo qua trang web của Cục An ninh địa phương)" },
    { country: "Hong Kong", phone: "999", email: "-", reportLink: "https://www.police.gov.hk/ppp_en/04_crime_matters/cybercrime_report.html" },
    { country: "Japan", phone: "110", email: "-", reportLink: "https://www.npa.go.jp/cyber/" },
    { country: "South Korea", phone: "112 / 118", email: "-", reportLink: "https://www.police.go.kr/eng/index.do?menuCd=020202" },
    { country: "Taiwan", phone: "110 / 165", email: "-", reportLink: "https://www.iwin.org.tw/" },
    { country: "Indonesia", phone: "110", email: "-", reportLink: "https://patrolisiber.id/" },
    { country: "Malaysia", phone: "999 / 997", email: "-", reportLink: "https://www.cybersecurity.my/" },
    { country: "Philippines", phone: "911", email: "-", reportLink: "https://www.anticybercrime.org/" },
    { country: "Singapore", phone: "999 / 1800-255-0000", email: "-", reportLink: "https://eservices.police.gov.sg/content/policehub/home.html" },
    { country: "Thailand", phone: "191", email: "-", reportLink: "http://www.technologycrime.go.th/" },
    { country: "Vietnam", phone: "113", email: "-", reportLink: "https://toxico.mps.gov.vn/" },
    { country: "India", phone: "100 / 112 / Hotline 1930", email: "-", reportLink: "https://cybercrime.gov.in/" },
    { country: "Pakistan", phone: "9911", email: "helpdesk@nr3c.gov.pk", reportLink: "https://www.fia.gov.pk/en/cyber-crime" },
    { country: "Bangladesh", phone: "999", email: "-", reportLink: "https://dmp.police.gov.bd/" },
    { country: "Sri Lanka", phone: "119", email: "-", reportLink: "https://cert.gov.lk/" },
    { country: "Nepal", phone: "100", email: "-", reportLink: "- (Đến trực tiếp hoặc gửi email đến Cục An ninh mạng)" }
  ];

  const englishSpeakingContacts: CountryContact[] = [
    { 
      country: "USA", 
      phone: "- (varies by state)", 
      email: "-", 
      reportLink: "https://www.ic3.gov/ (cybercrime), https://report.cybertip.org/ (child abuse)" 
    },
    { 
      country: "UK", 
      phone: "0300 123 2040 / 101 / 999", 
      email: "-", 
      reportLink: "https://www.actionfraud.police.uk/, https://www.ceop.police.uk/safety-centre/" 
    },
    { 
      country: "Canada", 
      phone: "1-888 495 8501 / 911", 
      email: "-", 
      reportLink: "https://www.antifraudcentre-centreantifraude.ca/, https://www.cybertip.ca/" 
    },
    { 
      country: "Australia", 
      phone: "1300 292 371 / 000", 
      email: "-", 
      reportLink: "https://www.cyber.gov.au/report, https://www.esafety.gov.au/report" 
    },
    { 
      country: "New Zealand", 
      phone: "0508 638 723 / 111 / 105", 
      email: "-", 
      reportLink: "https://report.netsafe.org.nz/, https://www.cert.govt.nz/" 
    },
    { 
      country: "Ireland", 
      phone: "1800 666 111 / 999 / 112", 
      email: "-", 
      reportLink: "https://www.crimestoppers.ie/, https://www.hotline.ie/" 
    },
    { 
      country: "South Africa", 
      phone: "08600 10111 / 10111", 
      email: "-", 
      reportLink: "https://www.saps.gov.za/services/crimestop.php" 
    }
  ];

  const internationalOrgs: CountryContact[] = [
    { country: "INTERPOL", phone: "-", email: "-", reportLink: "Luôn báo cáo qua cơ quan công an địa phương" },
    { country: "Europol (EC3)", phone: "-", email: "-", reportLink: "Cổng thông tin của cơ quan công an quốc gia (được liệt kê tại Europol)" },
    { country: "CEOP (UK child protection)", phone: "-", email: "-", reportLink: "https://www.ceop.police.uk/safety-centre/" },
    { country: "INHOPE", phone: "-", email: "-", reportLink: "https://www.inhope.org/" }
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
          
          <Accordion type="single" collapsible className="w-full mb-8">
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
          
          <h2 className="text-2xl font-bold mb-6 text-center">Danh bạ cơ quan chức năng quốc tế</h2>
          <p className="text-gray-600 mb-6 text-center">
            Dưới đây là danh sách các đầu mối liên hệ để báo cáo tội phạm mạng tại các quốc gia trên thế giới.
          </p>
          
          <Tabs defaultValue="asia" className="mb-8">
            <TabsList className="mb-4 flex justify-center">
              <TabsTrigger value="asia">Châu Á</TabsTrigger>
              <TabsTrigger value="english-speaking">Các nước nói tiếng Anh</TabsTrigger>
              <TabsTrigger value="international">Tổ chức quốc tế</TabsTrigger>
            </TabsList>
            
            <TabsContent value="asia" className="rounded-md border p-4">
              <h3 className="text-xl font-bold mb-4">Cơ quan chức năng tại Châu Á</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Quốc gia</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Liên kết báo cáo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asianContacts.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.country}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          {contact.email !== "-" ? (
                            <a href={`mailto:${contact.email}`} className="text-security hover:underline">
                              {contact.email}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.reportLink.startsWith("http") ? (
                            <a href={contact.reportLink} target="_blank" rel="noopener noreferrer" className="text-security hover:underline flex items-center">
                              <Globe className="h-4 w-4 mr-1" /> Truy cập
                            </a>
                          ) : (
                            contact.reportLink
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="english-speaking" className="rounded-md border p-4">
              <h3 className="text-xl font-bold mb-4">Cơ quan chức năng tại các nước nói tiếng Anh</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Quốc gia</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Liên kết báo cáo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {englishSpeakingContacts.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.country}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          {contact.email !== "-" ? (
                            <a href={`mailto:${contact.email}`} className="text-security hover:underline">
                              {contact.email}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.reportLink.includes("http") ? (
                            contact.reportLink.split(", ").map((link, i) => {
                              const [url, description] = link.split(" (");
                              const desc = description ? `(${description}` : "";
                              return (
                                <div key={i} className="mb-2">
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-security hover:underline flex items-center">
                                    <Globe className="h-4 w-4 mr-1" /> Truy cập {desc}
                                  </a>
                                </div>
                              );
                            })
                          ) : (
                            contact.reportLink
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="international" className="rounded-md border p-4">
              <h3 className="text-xl font-bold mb-4">Tổ chức quốc tế</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Tổ chức</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Liên kết báo cáo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internationalOrgs.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.country}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>
                          {contact.reportLink.startsWith("http") ? (
                            <a href={contact.reportLink} target="_blank" rel="noopener noreferrer" className="text-security hover:underline flex items-center">
                              <Globe className="h-4 w-4 mr-1" /> Truy cập
                            </a>
                          ) : (
                            contact.reportLink
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
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

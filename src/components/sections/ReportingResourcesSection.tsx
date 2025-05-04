import { Shield, Building, Flag, Mail, Phone, Globe, MapPin, Search } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

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

interface LocalContact {
  province: string;
  channels: {
    name: string;
    phone: string;
    email: string;
    reportLink: string;
    address: string;
  }[];
}

const ReportingResourcesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showCommandList, setShowCommandList] = useState(false);

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

  // Vietnamese provinces contacts
  const vietnamLocalContacts: LocalContact[] = [
    {
      province: "An Giang",
      channels: [
        {
          name: "Công an tỉnh An Giang (trực ban)",
          phone: "(0296) 3892 113",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "11 Lê Hồng Phong, TP. Long Xuyên, An Giang"
        },
        {
          name: "Sở TT&TT An Giang",
          phone: "(0296) 3952 568",
          email: "stttt@angiang.gov.vn",
          reportLink: "Không có",
          address: "6 Lê Triệu Kiết, P. Mỹ Bình, TP. Long Xuyên, An Giang"
        }
      ]
    },
    {
      province: "Bà Rịa – Vũng Tàu",
      channels: [
        {
          name: "Công an tỉnh BR-Vũng Tàu (Phòng ANM&PCTP CNC)",
          phone: "(0254) 3852 361",
          email: "congan@baria-vungtau.gov.vn",
          reportLink: "Không có",
          address: "15 Trường Chinh, P. Phước Trung, TP. Bà Rịa"
        },
        {
          name: "Sở TT&TT BR-Vũng Tàu",
          phone: "(0254) 3852 999",
          email: "stttt@baria-vungtau.gov.vn",
          reportLink: "Không có",
          address: "68 Trường Chinh, P. Phước Trung, TP. Bà Rịa, BR-VT"
        }
      ]
    },
    {
      province: "Bạc Liêu",
      channels: [
        {
          name: "Công an tỉnh Bạc Liêu (trực ban)",
          phone: "(0291) 3824 Báo cáo qua 113",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "01 Nguyễn Tất Thành, P. 1, TP. Bạc Liêu, Bạc Liêu"
        },
        {
          name: "Sở TT&TT Bạc Liêu",
          phone: "(0291) 3824 310",
          email: "stttt@baclieu.gov.vn",
          reportLink: "Không có",
          address: "02 Hùng Vương, P. 1, TP. Bạc Liêu, Bạc Liêu"
        }
      ]
    },
    {
      province: "Bắc Giang",
      channels: [
        {
          name: "Công an tỉnh Bắc Giang (trực ban hình sự)",
          phone: "0204.3855.266",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "20 Đường Xương Giang, TP. Bắc Giang, Bắc Giang"
        },
        {
          name: "Sở TT&TT Bắc Giang",
          phone: "0204.3555.996",
          email: "sottttvt@bacgiang.gov.vn",
          reportLink: "Không có",
          address: "Đường Hoàng Văn Thụ, TP. Bắc Giang, Bắc Giang"
        }
      ]
    },
    {
      province: "Bắc Kạn",
      channels: [
        {
          name: "Công an tỉnh Bắc Kạn (trực ban)",
          phone: "(0209) 3874 113",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Tổ 1A, P. Phùng Chí Kiên, TP. Bắc Kạn, Bắc Kạn"
        },
        {
          name: "Sở TT&TT Bắc Kạn",
          phone: "(0209) 3874 318",
          email: "stttt@backan.gov.vn",
          reportLink: "Không có",
          address: "16 Trường Chinh, P. Nguyễn Thị Minh Khai, TP. Bắc Kạn"
        }
      ]
    },
    {
      province: "Bắc Ninh",
      channels: [
        {
          name: "Công an tỉnh Bắc Ninh (đường dây nóng tố giác lừa đảo)",
          phone: "069.2609.999",
          email: "bbt.ca@bacninh.gov.vn",
          reportLink: "Không có",
          address: "14 Lý Thái Tổ, P. Suối Hoa, TP. Bắc Ninh"
        },
        {
          name: "Sở TT&TT Bắc Ninh",
          phone: "(0222) 3822 401",
          email: "stttt@bacninh.gov.vn",
          reportLink: "Không có",
          address: "33 Lý Thái Tổ, TP. Bắc Ninh, Bắc Ninh"
        }
      ]
    },
    {
      province: "Bến Tre",
      channels: [
        {
          name: "Công an tỉnh Bến Tre (trực ban)",
          phone: "(0275) 3822 197",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "404D Nguyễn Huệ, P. Phú Khương, TP. Bến Tre, Bến Tre"
        },
        {
          name: "Sở TT&TT Bến Tre",
          phone: "(0275) 3822 005",
          email: "stttt@bentre.gov.vn",
          reportLink: "Không có",
          address: "18 Cách Mạng Tháng Tám, P. An Hội, TP. Bến Tre, Bến Tre"
        }
      ]
    },
    {
      province: "Bình Định",
      channels: [
        {
          name: "Công an tỉnh Bình Định (trực ban)",
          phone: "(0256) 3822 387",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "114 Nguyễn Huệ, TP. Quy Nhơn, Bình Định"
        },
        {
          name: "Sở TT&TT Bình Định",
          phone: "(0256) 3818 388",
          email: "stttt@binhdinh.gov.vn",
          reportLink: "Không có",
          address: "316 Trần Hưng Đạo, TP. Quy Nhơn, Bình Định"
        }
      ]
    },
    // Continue adding other provinces...
    {
      province: "Hà Nội",
      channels: [
        {
          name: "Công an TP. Hà Nội (Phòng ANM&PCTP CNC)",
          phone: "Liên hệ Cục A05: 069.219.4053",
          email: "Không có thông tin",
          reportLink: "Ứng dụng VNeID",
          address: "87 Trần Hưng Đạo, Q. Hoàn Kiếm, Hà Nội"
        },
        {
          name: "Sở TT&TT Hà Nội",
          phone: "(024) 3512 3536 / (024) 3736 6620",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "185 Giảng Võ, Q. Đống Đa, Hà Nội"
        }
      ]
    },
    {
      province: "TP. Hồ Chí Minh",
      channels: [
        {
          name: "Công an TP. HCM (Phòng ANM&PCTP CNC)",
          phone: "0693.187.263",
          email: "anm.catphcm@gmail.com",
          reportLink: "Không có",
          address: "268 Trần Hưng Đạo, P. Nguyễn Cư Trinh, Q.1, TP. HCM"
        },
        {
          name: "Sở TT&TT TP. HCM",
          phone: "(028) 3520.2727",
          email: "ttcntttt@tphcm.gov.vn",
          reportLink: "Cổng 1022",
          address: "59 Lý Tự Trọng, P. Bến Nghé, Q.1, TP. HCM"
        }
      ]
    },
    {
      province: "Đà Nẵng",
      channels: [
        {
          name: "Công an TP. Đà Nẵng (Phòng ANM&PCTP CNC)",
          phone: "Không công bố",
          email: "bbtcatp@danang.gov.vn",
          reportLink: "Facebook: fb.com/congantpdanang",
          address: "47 Lý Tự Trọng, Q. Hải Châu, TP. Đà Nẵng"
        },
        {
          name: "Sở TT&TT Đà Nẵng",
          phone: "(0236) 3888 888",
          email: "stttt@danang.gov.vn",
          reportLink: "1022 Đà Nẵng",
          address: "15 Quang Trung, Q. Hải Châu, TP. Đà Nẵng"
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
    { country: "Nepal", phone: "100", email: "-", reportLink: "https://www.nepalpolice.gov.np/other_links/detail/cyber-bureau/" }
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

  // Filter local contacts based on search query
  const filteredLocalContacts = vietnamLocalContacts.filter((contact) =>
    contact.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle province selection
  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSearchQuery(province);
    setShowCommandList(false);
  };

  // Get the selected province details
  const selectedProvinceData = vietnamLocalContacts.find(
    (contact) => contact.province === selectedProvince
  );

  // Show command list when search query is not empty and no province is selected
  useEffect(() => {
    if (searchQuery && !selectedProvince) {
      setShowCommandList(true);
    } else {
      setShowCommandList(false);
    }
  }, [searchQuery, selectedProvince]);

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
          
          <Tabs defaultValue="local" className="mb-8">
            <TabsList className="mb-4 flex justify-center flex-wrap">
              <TabsTrigger value="local">Địa phương (Việt Nam)</TabsTrigger>
              <TabsTrigger value="asia">Châu Á</TabsTrigger>
              <TabsTrigger value="english-speaking">Các nước nói tiếng Anh</TabsTrigger>
              <TabsTrigger value="international">Tổ chức quốc tế</TabsTrigger>
            </TabsList>
            
            <TabsContent value="local" className="rounded-md border p-4">
              <h3 className="text-xl font-bold mb-4">Cơ quan chức năng tại các tỉnh thành Việt Nam</h3>
              <div className="mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                  <p className="text-sm">
                    Tìm kiếm đầu mối liên hệ của Công an và Sở Thông tin & Truyền thông tại các tỉnh thành Việt Nam. 
                    Bạn có thể báo cáo trực tiếp tới các đơn vị này khi gặp lừa đảo trực tuyến.
                  </p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm tỉnh thành..."
                      className="max-w-sm"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === "") setSelectedProvince(null);
                      }}
                    />
                  </div>

                  {showCommandList && filteredLocalContacts.length > 0 && (
                    <div className="border rounded-md max-w-sm mb-4">
                      <Command>
                        <CommandInput 
                          placeholder="Tìm kiếm tỉnh thành..." 
                          value={searchQuery} 
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-72">
                              {filteredLocalContacts.map((contact) => (
                                <CommandItem 
                                  key={contact.province} 
                                  onSelect={() => handleProvinceSelect(contact.province)}
                                  value={contact.province}
                                  className="cursor-pointer"
                                >
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {contact.province}
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}

                  {selectedProvince && selectedProvinceData && (
                    <Card key={selectedProvinceData.province} className="mb-4">
                      <CardHeader className="bg-security/10 p-4">
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-security" />
                          {selectedProvinceData.province}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {selectedProvinceData.channels.map((channel, idx) => (
                          <div key={idx} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                            <h4 className="font-medium text-sm mb-2">{channel.name}</h4>
                            
                            {channel.phone !== "Không có thông tin" && (
                              <div className="flex items-start text-xs mb-1">
                                <Phone className="h-3.5 w-3.5 text-security mr-1.5 mt-0.5 flex-shrink-0" />
                                <span>{channel.phone}</span>
                              </div>
                            )}
                            
                            {channel.email !== "Không có thông tin" && (
                              <div className="flex items-start text-xs mb-1">
                                <Mail className="h-3.5 w-3.5 text-security mr-1.5 mt-0.5 flex-shrink-0" />
                                <a 
                                  href={`mailto:${channel.email}`}
                                  className="text-security hover:underline break-all"
                                >
                                  {channel.email}
                                </a>
                              </div>
                            )}
                            
                            {channel.reportLink !== "Không có" && (
                              <div className="flex items-start text-xs mb-1">
                                <Globe className="h-3.5 w-3.5 text-security mr-1.5 mt-0.5 flex-shrink-0" />
                                <span>{channel.reportLink}</span>
                              </div>
                            )}
                            
                            <div className="flex items-start text-xs">
                              <MapPin className="h-3.5 w-3.5 text-security mr-1.5 mt-0.5 flex-shrink-0" />
                              <span>{channel.address}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {!selectedProvince && !showCommandList && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredLocalContacts.slice(0, 6).map((province) => (
                        <Card 
                          key={province.province} 
                          className="overflow-hidden cursor-pointer hover:border-security/50 transition-colors"
                          onClick={() => setSelectedProvince(province.province)}
                        >
                          <CardHeader className="bg-security/10 p-4">
                            <CardTitle className="text-lg flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-security" />
                              {province.province}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500">
                              Nhấn để xem chi tiết thông tin liên hệ
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {!searchQuery && !selectedProvince && (
                    <div className="flex justify-center mt-4">
                      <Select onValueChange={(value) => handleProvinceSelect(value)}>
                        <SelectTrigger className="w-full max-w-sm">
                          <SelectValue placeholder="Chọn tỉnh thành để xem thông tin" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-72">
                            {vietnamLocalContacts.map((contact) => (
                              <SelectItem key={contact.province} value={contact.province}>
                                {contact.province}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
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


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

interface InternationalOrg {
  organization: string;
  phone: string;
  email: string;
  reportLink: string;
}

const ReportingResourcesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showCommandList, setShowCommandList] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [activeDataSource, setActiveDataSource] = useState<'resources' | 'local' | 'asian' | 'english' | 'international'>('resources');

  // Asian countries data
  const asianCountries: CountryContact[] = [
    {
      country: "China",
      phone: "110 (police) / 96110",
      email: "–",
      reportLink: "– (báo cáo qua trang web Cục An ninh Công cộng địa phương)"
    },
    {
      country: "Hong Kong",
      phone: "999",
      email: "–",
      reportLink: "https://www.police.gov.hk/ppp_en/04_crime_matters/cybercrime_report.html"
    },
    {
      country: "Japan",
      phone: "110",
      email: "–",
      reportLink: "https://www.npa.go.jp/cyber/"
    },
    {
      country: "South Korea",
      phone: "112 / 118",
      email: "–",
      reportLink: "https://www.police.go.kr/eng/index.do?menuCd=020202"
    },
    {
      country: "Taiwan",
      phone: "110 / 165",
      email: "–",
      reportLink: "https://www.iwin.org.tw/"
    },
    {
      country: "Indonesia",
      phone: "110",
      email: "–",
      reportLink: "https://patrolisiber.id/"
    },
    {
      country: "Malaysia",
      phone: "999 / 997",
      email: "report@cyber57.gov.my",
      reportLink: "https://www.cybersecurity.my/"
    },
    {
      country: "Philippines",
      phone: "911",
      email: "info@cicc.gov.ph",
      reportLink: "https://www.anticybercrime.org/"
    },
    {
      country: "Singapore",
      phone: "999 / 1800-255-0000",
      email: "–",
      reportLink: "https://eservices.police.gov.sg/content/policehub/home.html"
    },
    {
      country: "Thailand",
      phone: "191",
      email: "–",
      reportLink: "http://www.technologycrime.go.th/"
    },
    {
      country: "Vietnam",
      phone: "113",
      email: "toxico@canhsat.vn",
      reportLink: "https://toxico.mps.gov.vn/"
    },
    {
      country: "India",
      phone: "100 / 112 / Hotline 1930",
      email: "–",
      reportLink: "https://cybercrime.gov.in/"
    },
    {
      country: "Pakistan",
      phone: "9911",
      email: "helpdesk@nr3c.gov.pk",
      reportLink: "https://www.fia.gov.pk/en/cyber-crime"
    },
    {
      country: "Bangladesh",
      phone: "999",
      email: "–",
      reportLink: "https://dmp.police.gov.bd/"
    },
    {
      country: "Sri Lanka",
      phone: "119",
      email: "report@cert.gov.lk",
      reportLink: "https://cert.gov.lk/"
    },
    {
      country: "Nepal",
      phone: "100",
      email: "cyberbureau@nepalpolice.gov.np",
      reportLink: "https://www.nepalpolice.gov.np/other_links/detail/cyber-bureau/"
    }
  ];

  // English-speaking countries data
  const englishSpeakingCountries: CountryContact[] = [
    {
      country: "USA",
      phone: "– (see below)",
      email: "–",
      reportLink: "https://www.ic3.gov/ (cybercrime)\nhttps://report.cybertip.org/ (child abuse)"
    },
    {
      country: "UK",
      phone: "0300 123 2040 / 101 / 999",
      email: "–",
      reportLink: "https://www.actionfraud.police.uk/\nhttps://www.ceop.police.uk/safety-centre/"
    },
    {
      country: "Canada",
      phone: "1-888 495 8501 / 911",
      email: "–",
      reportLink: "https://www.antifraudcentre-centreantifraude.ca/\nhttps://www.cybertip.ca/"
    },
    {
      country: "Australia",
      phone: "1300 292 371 / 000",
      email: "–",
      reportLink: "https://www.cyber.gov.au/report\nhttps://www.esafety.gov.au/report"
    },
    {
      country: "New Zealand",
      phone: "0508 638 723 / 111 / 105",
      email: "–",
      reportLink: "https://report.netsafe.org.nz/\nhttps://www.cert.govt.nz/"
    },
    {
      country: "Ireland",
      phone: "1800 666 111 / 999 / 112",
      email: "–",
      reportLink: "https://www.crimestoppers.ie/\nhttps://www.hotline.ie/"
    },
    {
      country: "South Africa",
      phone: "08600 10111 / 10111",
      email: "–",
      reportLink: "https://www.saps.gov.za/services/crimestop.php"
    }
  ];

  // International organizations data
  const internationalOrganizations: InternationalOrg[] = [
    {
      organization: "INTERPOL",
      phone: "–",
      email: "–",
      reportLink: "Luôn báo cáo thông qua cảnh sát địa phương"
    },
    {
      organization: "Europol (EC3)",
      phone: "–",
      email: "–",
      reportLink: "Cổng thông tin cảnh sát quốc gia (được liệt kê tại Europol)"
    },
    {
      organization: "CEOP (UK child protection)",
      phone: "–",
      email: "–",
      reportLink: "https://www.ceop.police.uk/safety-centre/"
    },
    {
      organization: "INHOPE",
      phone: "–",
      email: "–",
      reportLink: "https://www.inhope.org/"
    }
  ];

  useEffect(() => {
    // Initialize default values before any filtering
    let initialItems: any[] = [];
    switch (activeDataSource) {
      case 'asian':
        initialItems = [...asianCountries];
        break;
      case 'english':
        initialItems = [...englishSpeakingCountries];
        break;
      case 'international':
        initialItems = [...internationalOrganizations];
        break;
      case 'local':
        initialItems = [...vietnamLocalContacts];
        break;
      case 'resources':
      default:
        initialItems = [...resourceCategories];
        break;
    }
    
    // Filter data based on the active tab and search query
    if (searchQuery.trim()) {
      switch (activeDataSource) {
        case 'asian':
          setFilteredItems(asianCountries.filter(country => 
            country.country.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'english':
          setFilteredItems(englishSpeakingCountries.filter(country => 
            country.country.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'international':
          setFilteredItems(internationalOrganizations.filter(org => 
            org.organization.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'local':
          setFilteredItems(vietnamLocalContacts.filter(province => 
            province.province.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'resources':
        default:
          const filteredCategories = [...resourceCategories];
          // Filter the resources within each category
          filteredCategories.forEach(category => {
            category.resources = category.resources.filter(resource => 
              resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
          });
          // Only keep categories that have matching resources
          setFilteredItems(filteredCategories.filter(category => category.resources.length > 0));
          break;
      }
    } else {
      // If no search query, show all items
      setFilteredItems(initialItems);
    }
  }, [searchQuery, activeDataSource]);

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
        },
        {
          name: "Microsoft",
          url: "https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site",
          description: "Báo cáo trang web độc hại trên Microsoft."
        },
        {
          name: "Fortiguard",
          url: "https://www.fortiguard.com/webfilter",
          description: "Công cụ phân tích và báo cáo trang web độc hại của Fortinet."
        },
        {
          name: "BrightCloud",
          url: "https://www.brightcloud.com/tools/url-ip-lookup.php",
          description: "Công cụ kiểm tra và phân loại URL/IP của Webroot."
        },
        {
          name: "CRDF",
          url: "https://threatcenter.crdf.fr/submit_url.html",
          description: "Trung tâm báo cáo mối đe dọa của CRDF."
        },
        {
          name: "Netcraft",
          url: "https://report.netcraft.com/report",
          description: "Báo cáo trang web lừa đảo và độc hại."
        },
        {
          name: "Palo Alto Networks",
          url: "https://urlfiltering.paloaltonetworks.com/",
          description: "Dịch vụ lọc URL của Palo Alto Networks."
        },
        {
          name: "ESET",
          url: "https://phishing.eset.com/en-us/report",
          description: "Báo cáo trang web lừa đảo đến ESET."
        },
        {
          name: "Trend Micro",
          url: "https://global.sitesafety.trendmicro.com/index.php",
          description: "Kiểm tra và báo cáo độ an toàn của trang web."
        },
        {
          name: "BitDefender",
          url: "https://www.youtube.com/watch?v=0fIUiv9-UFk",
          description: "Hướng dẫn báo cáo trang web độc hại đến BitDefender."
        },
        {
          name: "McAfee",
          url: "https://sitelookup.mcafee.com/",
          description: "Kiểm tra an toàn trang web và báo cáo với McAfee."
        },
        {
          name: "Forcepoint",
          url: "https://csi.forcepoint.com/",
          description: "Kiểm tra trang web và báo cáo phân loại sai với Forcepoint."
        },
        {
          name: "Symantec",
          url: "https://sitereview.symantec.com/#/",
          description: "Đánh giá và báo cáo trang web với Symantec."
        },
        {
          name: "Spam404",
          url: "https://www.spam404.com/report.html",
          description: "Báo cáo trang web lừa đảo và scam với Spam404."
        },
        {
          name: "Kaspersky",
          url: "https://opentip.kaspersky.com/",
          description: "Công cụ phân tích URL và file độc hại của Kaspersky."
        },
        {
          name: "Cisco Talos",
          url: "https://talosintelligence.com/reputation_center",
          description: "Kiểm tra và báo cáo URL/IP đáng ngờ với Cisco Talos."
        },
        {
          name: "Avira",
          url: "https://www.avira.com/en/analysis/submit-url",
          description: "Gửi URL đáng ngờ để Avira phân tích."
        },
        {
          name: "Alibaba",
          url: "https://www.alibabacloud.com/ko/report?_p_lc=1",
          description: "Báo cáo trang web độc hại với Alibaba Cloud."
        },
        {
          name: "ICANN",
          url: "https://icann-nsp.my.site.com/compliance/s/abuse-domain",
          description: "Báo cáo lạm dụng tên miền với ICANN."
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
    {
      province: "Bình Dương",
      channels: [
        {
          name: "Công an tỉnh Bình Dương (đường dây nóng)",
          phone: "(0274) 3822 638",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "681 CMT8, P. Chánh Nghĩa, TP. Thủ Dầu Một, Bình Dương"
        },
        {
          name: "Sở TT&TT Bình Dương",
          phone: "(0274) 3822 000",
          email: "stttt@binhduong.gov.vn",
          reportLink: "Không có",
          address: "Tầng 20 Tháp A, Tòa nhà Trung tâm Hành chính, TP. Thủ Dầu Một, Bình Dương"
        }
      ]
    },
    {
      province: "Bình Phước",
      channels: [
        {
          name: "Công an tỉnh Bình Phước (đường dây nóng)",
          phone: "(0271) 3879 434",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "12 Trần Hưng Đạo, P. Tân Phú, TP. Đồng Xoài, Bình Phước"
        },
        {
          name: "Sở TT&TT Bình Phước",
          phone: "(0271) 3880 161",
          email: "stttt@binhphuoc.gov.vn",
          reportLink: "Không có",
          address: "0QL14, P. Tân Phú, TP. Đồng Xoài, Bình Phước"
        }
      ]
    },
    {
      province: "Bình Thuận",
      channels: [
        {
          name: "Công an tỉnh Bình Thuận (trực ban)",
          phone: "(0252) 3862 113",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "347 Thủ Khoa Huân, TP. Phan Thiết, Bình Thuận"
        },
        {
          name: "Sở TT&TT Bình Thuận",
          phone: "(0252) 3833 500",
          email: "stttt@binhthuan.gov.vn",
          reportLink: "Không có",
          address: "06 Nguyễn Tất Thành, TP. Phan Thiết, Bình Thuận"
        }
      ]
    },
    {
      province: "Cà Mau",
      channels: [
        {
          name: "Công an tỉnh Cà Mau (trực ban)",
          phone: "(0290) 3839 113",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "85 Lý Thường Kiệt, P. 6, TP. Cà Mau, Cà Mau"
        },
        {
          name: "Sở TT&TT Cà Mau",
          phone: "(0290) 3822 382",
          email: "stttt@camau.gov.vn",
          reportLink: "Không có",
          address: "64 Phan Đình Phùng, P. 9, TP. Cà Mau, Cà Mau"
        }
      ]
    },
    {
      province: "Cần Thơ",
      channels: [
        {
          name: "Công an TP. Cần Thơ (đường dây nóng)",
          phone: "069.3672.888",
          email: "catp@cantho.gov.vn",
          reportLink: "Không có",
          address: "9A Trần Phú, P. Cái Khế, Q. Ninh Kiều, TP. Cần Thơ"
        },
        {
          name: "Sở TT&TT Cần Thơ",
          phone: "(0292) 3762 222",
          email: "stttt@cantho.gov.vn",
          reportLink: "Không có",
          address: "1A Ngô Văn Sở, P. Tân An, Q. Ninh Kiều, TP. Cần Thơ"
        }
      ]
    },
    {
      province: "Cao Bằng",
      channels: [
        {
          name: "Công an tỉnh Cao Bằng (trực ban)",
          phone: "(0206) 3856 226",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "123 Xuân Trường, P. Hợp Giang, TP. Cao Bằng, Cao Bằng"
        },
        {
          name: "Sở TT&TT Cao Bằng",
          phone: "(0206) 3753 789",
          email: "stttt@caobang.gov.vn",
          reportLink: "Không có",
          address: "11 Hoàng Đình Giong, P. Hợp Giang, TP. Cao Bằng, Cao Bằng"
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
    },
    {
      province: "Đắk Lắk",
      channels: [
        {
          name: "Công an tỉnh Đắk Lắk (đường dây nóng tố giác)",
          phone: "0694.389.211\n02623.818.568",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "58 Nguyễn Tất Thành, TP. Buôn Ma Thuột, Đắk Lắk"
        },
        {
          name: "Sở TT&TT Đắk Lắk",
          phone: "(0262) 3851 788",
          email: "stttt@daklak.gov.vn",
          reportLink: "Không có",
          address: "08 Nguyễn Tất Thành, TP. Buôn Ma Thuột, Đắk Lắk"
        }
      ]
    },
    {
      province: "Đắk Nông",
      channels: [
        {
          name: "Công an tỉnh Đắk Nông (đường dây nóng)",
          phone: "0261.3551.567\n0261.3546.788",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Tổ 2, P. Nghĩa Phú, TP. Gia Nghĩa, Đắk Nông"
        },
        {
          name: "Sở TT&TT Đắk Nông",
          phone: "(0261) 3545 678",
          email: "stttt@daknong.gov.vn",
          reportLink: "Không có",
          address: "23 Huỳnh Thúc Kháng, P. Nghĩa Tân, TP. Gia Nghĩa, Đắk Nông"
        }
      ]
    },
    {
      province: "Điện Biên",
      channels: [
        {
          name: "Công an tỉnh Điện Biên (trực ban)",
          phone: "(0215) 3824 328",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "679 Võ Nguyên Giáp, P. Him Lam, TP. Điện Biên Phủ, Điện Biên"
        },
        {
          name: "Sở TT&TT Điện Biên",
          phone: "(0215) 3814 446",
          email: "stttt@dienbien.gov.vn",
          reportLink: "Không có",
          address: "Tổ 2, P. Mường Thanh, TP. Điện Biên Phủ, Điện Biên"
        }
      ]
    },
    {
      province: "Đồng Nai",
      channels: [
        {
          name: "Công an tỉnh Đồng Nai (đường dây nóng)",
          phone: "(0251) 8820 999",
          email: "congan@dongnai.gov.vn",
          reportLink: "Không có",
          address: "161 Phạm Văn Thuận, P. Tân Tiến, TP. Biên Hòa, Đồng Nai"
        },
        {
          name: "Sở TT&TT Đồng Nai",
          phone: "(0251) 3822 999",
          email: "stttt@dongnai.gov.vn",
          reportLink: "Không có",
          address: "15 Đồng Khởi, P. Tân Tiến, TP. Biên Hòa, Đồng Nai"
        }
      ]
    },
    {
      province: "Đồng Tháp",
      channels: [
        {
          name: "Công an tỉnh Đồng Tháp (trực ban)",
          phone: "(0277) 3883 138",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "15 Lê Đại Hành, P. Mỹ Phú, TP. Cao Lãnh, Đồng Tháp"
        },
        {
          name: "Sở TT&TT Đồng Tháp",
          phone: "(0277) 3872 451",
          email: "stttt@dongthap.gov.vn",
          reportLink: "Không có",
          address: "27 Lê Quý Đôn, P. 1, TP. Cao Lãnh, Đồng Tháp"
        }
      ]
    },
    {
      province: "Gia Lai",
      channels: [
        {
          name: "Công an tỉnh Gia Lai (Phòng ANM&PCTP CNC)",
          phone: "(0269) 3823 903",
          email: "gialai@canhsat.vn",
          reportLink: "Không có",
          address: "267A Trần Phú, P. Diên Hồng, TP. Pleiku, Gia Lai"
        },
        {
          name: "Sở TT&TT Gia Lai",
          phone: "(0269) 3822 326",
          email: "stttt@gialai.gov.vn",
          reportLink: "Không có",
          address: "17 Trần Hưng Đạo, TP. Pleiku, Gia Lai"
        }
      ]
    },
    {
      province: "Hà Giang",
      channels: [
        {
          name: "Công an tỉnh Hà Giang (trực ban)",
          phone: "(0219) 3863 268",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "170 Trần Phú, P. Minh Khai, TP. Hà Giang, Hà Giang"
        },
        {
          name: "Sở TT&TT Hà Giang",
          phone: "(0219) 3865 404",
          email: "stttt@hagiang.gov.vn",
          reportLink: "Không có",
          address: "148 Trần Phú, P. Minh Khai, TP. Hà Giang, Hà Giang"
        }
      ]
    },
    {
      province: "Hà Nam",
      channels: [
        {
          name: "Công an tỉnh Hà Nam (đường dây nóng)",
          phone: "(0226) 3852 673",
          email: "conganhanamonline@gmail.com",
          reportLink: "Tố giác online",
          address: "558 Lý Thường Kiệt, P. Lê Hồng Phong, TP. Phủ Lý, Hà Nam"
        },
        {
          name: "Sở TT&TT Hà Nam",
          phone: "(0226) 3852 968",
          email: "stttt@hanam.gov.vn",
          reportLink: "Không có",
          address: "9 Trần Phú, TP. Phủ Lý, Hà Nam"
        }
      ]
    },
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
          phone: "(024) 3512 3536\n(024) 3736 6620",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "185 Giảng Võ, Q. Đống Đa, Hà Nội"
        }
      ]
    },
    {
      province: "Hà Tĩnh",
      channels: [
        {
          name: "Công an tỉnh Hà Tĩnh (đường dây nóng)",
          phone: "069.2926.112\n069.2928.312",
          email: "admin@conganhatinh.gov.vn",
          reportLink: "Facebook: fb.com/conganhatinh",
          address: "04 Nguyễn Thiếp, TP. Hà Tĩnh, Hà Tĩnh"
        },
        {
          name: "Sở TT&TT Hà Tĩnh",
          phone: "(0239) 3856 266",
          email: "stttt@hatinh.gov.vn",
          reportLink: "Không có",
          address: "64 Phan Đình Phùng, TP. Hà Tĩnh, Hà Tĩnh"
        }
      ]
    },
    {
      province: "Hải Dương",
      channels: [
        {
          name: "Công an tỉnh Hải Dương (Phòng ANM&PCTP CNC)",
          phone: "084.615.1151",
          email: "Không có thông tin",
          reportLink: "Facebook: fb.com/Tocongtac151CongantinhHaiDuong",
          address: "35B Đại lộ Hồ Chí Minh, P. Nguyễn Trãi, TP. Hải Dương"
        },
        {
          name: "Sở TT&TT Hải Dương",
          phone: "(0220) 3891 888",
          email: "stttt@haiduong.gov.vn",
          reportLink: "Không có",
          address: "4 Thống Nhất, P. Lê Thanh Nghị, TP. Hải Dương, Hải Dương"
        }
      ]
    },
    {
      province: "Hải Phòng",
      channels: [
        {
          name: "Công an TP. Hải Phòng (trực ban)",
          phone: "(0225) 3747 138",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "4 Lê Đại Hành, Q. Hồng Bàng, TP. Hải Phòng"
        },
        {
          name: "Sở TT&TT Hải Phòng",
          phone: "(0225) 3820 888",
          email: "sotttt@haiphong.gov.vn",
          reportLink: "Không có",
          address: "62 Trần Phú, Q. Ngô Quyền, TP. Hải Phòng"
        }
      ]
    },
    {
      province: "Hậu Giang",
      channels: [
        {
          name: "Công an tỉnh Hậu Giang (trực ban)",
          phone: "(0293) 3873 138",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "9 Điện Biên Phủ, KV4, P. V, TP. Vị Thanh, Hậu Giang"
        },
        {
          name: "Sở TT&TT Hậu Giang",
          phone: "(0293) 3583 399",
          email: "stttt@haugiang.gov.vn",
          reportLink: "Không có",
          address: "02 Điện Biên Phủ, P. V, TP. Vị Thanh, Hậu Giang"
        }
      ]
    },
    {
      province: "Hòa Bình",
      channels: [
        {
          name: "Công an tỉnh Hòa Bình (trực ban)",
          phone: "(0218) 3854 284",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "473 Trần Hưng Đạo, TP. Hòa Bình, Hòa Bình"
        },
        {
          name: "Sở TT&TT Hòa Bình",
          phone: "(0218) 3854 305",
          email: "stttt@hoabinh.gov.vn",
          reportLink: "Không có",
          address: "25 An Dương Vương, P. Phương Lâm, TP. Hòa Bình, Hòa Bình"
        }
      ]
    },
    {
      province: "Hưng Yên",
      channels: [
        {
          name: "Công an tỉnh Hưng Yên (Phòng ANM&PCTP CNC)",
          phone: "(0221) 3863 465",
          email: "conganhungyen@hungyen.gov.vn",
          reportLink: "Không có",
          address: "45 Hải Thượng Lãn Ông, P. Hiến Nam, TP. Hưng Yên"
        },
        {
          name: "Sở TT&TT Hưng Yên",
          phone: "(0221) 3861 394",
          email: "stttt@hungyen.gov.vn",
          reportLink: "Không có",
          address: "Đường Quảng Trường, P. Hiến Nam, TP. Hưng Yên, Hưng Yên"
        }
      ]
    },
    {
      province: "Khánh Hòa",
      channels: [
        {
          name: "Công an tỉnh Khánh Hòa (trực ban)",
          phone: "(0258) 3852 113",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "80 Trần Phú, TP. Nha Trang, Khánh Hòa"
        },
        {
          name: "Sở TT&TT Khánh Hòa",
          phone: "(0258) 3819 200",
          email: "stttt@khanhhoa.gov.vn",
          reportLink: "Không có",
          address: "01 Trần Phú, TP. Nha Trang, Khánh Hòa"
        }
      ]
    },
    {
      province: "Kiên Giang",
      channels: [
        {
          name: "Công an tỉnh Kiên Giang (trực ban)",
          phone: "(0297) 3862 888",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "20 Lạc Hồng, P. Vĩnh Lạc, TP. Rạch Giá, Kiên Giang"
        },
        {
          name: "Sở TT&TT Kiên Giang",
          phone: "(0297) 3944 405",
          email: "stttt@kiengiang.gov.vn",
          reportLink: "Không có",
          address: "25 Trần Hưng Đạo, P. Vĩnh Thanh Vân, TP. Rạch Giá, Kiên Giang"
        }
      ]
    },
    {
      province: "Kon Tum",
      channels: [
        {
          name: "Công an tỉnh Kon Tum (trực ban)",
          phone: "(0260) 3862 260",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "294 Bà Triệu, P. Quang Trung, TP. Kon Tum, Kon Tum"
        },
        {
          name: "Sở TT&TT Kon Tum",
          phone: "(0260) 3911 888",
          email: "stttt@kontum.gov.vn",
          reportLink: "Không có",
          address: "112 Trần Phú, TP. Kon Tum, Kon Tum"
        }
      ]
    },
    {
      province: "Lai Châu",
      channels: [
        {
          name: "Công an tỉnh Lai Châu (trực ban)",
          phone: "(0213) 3876 513",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Phường Đông Phong, TP. Lai Châu, Lai Châu"
        },
        {
          name: "Sở TT&TT Lai Châu",
          phone: "(0213) 3876 688",
          email: "stttt@laichau.gov.vn",
          reportLink: "Không có",
          address: "Tổ 23, P. Tân Phong, TP. Lai Châu, Lai Châu"
        }
      ]
    },
    {
      province: "Lâm Đồng",
      channels: [
        {
          name: "Công an tỉnh Lâm Đồng (trực ban)",
          phone: "(0263) 3822 164",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "01 Trần Quốc Toản, P. 10, TP. Đà Lạt, Lâm Đồng"
        },
        {
          name: "Sở TT&TT Lâm Đồng",
          phone: "(0263) 3822 000",
          email: "stttt@lamdong.gov.vn",
          reportLink: "Không có",
          address: "02 Trần Quốc Toản, P. 10, TP. Đà Lạt, Lâm Đồng"
        }
      ]
    },
    {
      province: "Lạng Sơn",
      channels: [
        {
          name: "Công an tỉnh Lạng Sơn (trực ban)",
          phone: "(0205) 3812 613",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Số 04, đường Cửa Nam, P. Chi Lăng, TP. Lạng Sơn, Lạng Sơn"
        },
        {
          name: "Sở TT&TT Lạng Sơn",
          phone: "(0205) 3814 605",
          email: "stttt@langson.gov.vn",
          reportLink: "Không có",
          address: "Số 151, đường Hoàng Văn Thụ, P. Chi Lăng, TP. Lạng Sơn"
        }
      ]
    },
    {
      province: "Lào Cai",
      channels: [
        {
          name: "Công an tỉnh Lào Cai (trực ban)",
          phone: "(0214) 3824 954",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Đại lộ Trần Hưng Đạo, P. Nam Cường, TP. Lào Cai, Lào Cai"
        },
        {
          name: "Sở TT&TT Lào Cai",
          phone: "(0214) 3840 046",
          email: "contact-stttt@laocai.gov.vn",
          reportLink: "Không có",
          address: "Đường Hoàng Liên, TP. Lào Cai, Lào Cai"
        }
      ]
    },
    {
      province: "Long An",
      channels: [
        {
          name: "Công an tỉnh Long An (trực ban)",
          phone: "(0272) 3825 555",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Số 76 Châu Văn Giác, P. 5, TP. Tân An, Long An"
        },
        {
          name: "Sở TT&TT Long An",
          phone: "(0272) 3821 678",
          email: "stttt@longan.gov.vn",
          reportLink: "Không có",
          address: "62 Cách Mạng Tháng 8, P.1, TP. Tân An, Long An"
        }
      ]
    },
    {
      province: "Nam Định",
      channels: [
        {
          name: "Công an tỉnh Nam Định (trực ban)",
          phone: "(0228) 3849 238",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "55 Đông A, P. Cửa Bắc, TP. Nam Định, Nam Định"
        },
        {
          name: "Sở TT&TT Nam Định",
          phone: "(0228) 3631 468",
          email: "stttt@namdinh.gov.vn",
          reportLink: "Không có",
          address: "21 Đường Hoàng Hoa Thám, TP. Nam Định, Nam Định"
        }
      ]
    },
    {
      province: "Nghệ An",
      channels: [
        {
          name: "Công an tỉnh Nghệ An (trực ban)",
          phone: "(0238) 3830 279",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "65 Nguyễn Thái Học, TP. Vinh, Nghệ An"
        },
        {
          name: "Sở TT&TT Nghệ An",
          phone: "(0238) 3844 093",
          email: "tttt@nghean.gov.vn",
          reportLink: "Không có",
          address: "06 Đại lộ V.I.Lê Nin, TP. Vinh, Nghệ An"
        }
      ]
    },
    {
      province: "Ninh Bình",
      channels: [
        {
          name: "Công an tỉnh Ninh Bình (trực ban)",
          phone: "(0229) 3874 582",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Đường Nguyễn Huệ, P. Nam Thành, TP. Ninh Bình, Ninh Bình"
        },
        {
          name: "Sở TT&TT Ninh Bình",
          phone: "(0229) 3873 388",
          email: "stttt@ninhbinh.gov.vn",
          reportLink: "Không có",
          address: "50 Lê Hồng Phong, P. Đông Thành, TP. Ninh Bình, Ninh Bình"
        }
      ]
    },
    {
      province: "Ninh Thuận",
      channels: [
        {
          name: "Công an tỉnh Ninh Thuận (trực ban)",
          phone: "(0259) 3823 015",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "01 Ngô Gia Tự, P. Tấn Tài, TP. Phan Rang-Tháp Chàm, Ninh Thuận"
        },
        {
          name: "Sở TT&TT Ninh Thuận",
          phone: "(0259) 3835 688",
          email: "sotttt@ninhthuan.gov.vn",
          reportLink: "Không có",
          address: "17 Nguyễn Trãi, TP. Phan Rang-Tháp Chàm, Ninh Thuận"
        }
      ]
    },
    {
      province: "Phú Thọ",
      channels: [
        {
          name: "Công an tỉnh Phú Thọ (trực ban)",
          phone: "(0210) 3855 516",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Phường Tân Dân, TP. Việt Trì, Phú Thọ"
        },
        {
          name: "Sở TT&TT Phú Thọ",
          phone: "(0210) 3846 462",
          email: "sotttt@phutho.gov.vn",
          reportLink: "Không có",
          address: "1335 đường Hùng Vương, P. Tiên Cát, TP. Việt Trì, Phú Thọ"
        }
      ]
    },
    {
      province: "Phú Yên",
      channels: [
        {
          name: "Công an tỉnh Phú Yên (trực ban)",
          phone: "(0257) 3823 580",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "159 Nguyễn Huệ, TP. Tuy Hòa, Phú Yên"
        },
        {
          name: "Sở TT&TT Phú Yên",
          phone: "(0257) 3843 800",
          email: "stttt@phuyen.gov.vn",
          reportLink: "Không có",
          address: "02 Trần Phú, TP. Tuy Hòa, Phú Yên"
        }
      ]
    },
    {
      province: "Quảng Bình",
      channels: [
        {
          name: "Công an tỉnh Quảng Bình (trực ban)",
          phone: "(0232) 3822 324",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "27 Nguyễn Hữu Cảnh, P. Đồng Hới, TP. Đồng Hới, Quảng Bình"
        },
        {
          name: "Sở TT&TT Quảng Bình",
          phone: "(0232) 3823 888",
          email: "stttt@quangbinh.gov.vn",
          reportLink: "Không có",
          address: "02 Hương Giang, TP. Đồng Hới, Quảng Bình"
        }
      ]
    },
    {
      province: "Quảng Nam",
      channels: [
        {
          name: "Công an tỉnh Quảng Nam (trực ban)",
          phone: "(0235) 3852 589",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "19 Trần Hưng Đạo, TP. Tam Kỳ, Quảng Nam"
        },
        {
          name: "Sở TT&TT Quảng Nam",
          phone: "(0235) 3811 888",
          email: "stttt@quangnam.gov.vn",
          reportLink: "Không có",
          address: "268 Trưng Nữ Vương, TP. Tam Kỳ, Quảng Nam"
        }
      ]
    },
    {
      province: "Quảng Ngãi",
      channels: [
        {
          name: "Công an tỉnh Quảng Ngãi (trực ban)",
          phone: "(0255) 3826 417",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "40 Hàm Nghi, TP. Quảng Ngãi, Quảng Ngãi"
        },
        {
          name: "Sở TT&TT Quảng Ngãi",
          phone: "(0255) 3828 555",
          email: "stttt@quangngai.gov.vn",
          reportLink: "Không có",
          address: "19 Hùng Vương, TP. Quảng Ngãi, Quảng Ngãi"
        }
      ]
    },
    {
      province: "Quảng Ninh",
      channels: [
        {
          name: "Công an tỉnh Quảng Ninh (trực ban)",
          phone: "(0203) 3836 006",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Phường Hồng Hà, TP. Hạ Long, Quảng Ninh"
        },
        {
          name: "Sở TT&TT Quảng Ninh",
          phone: "(0203) 3835 678",
          email: "stttt@quangninh.gov.vn",
          reportLink: "Không có",
          address: "Đường 25/4, P. Bạch Đằng, TP. Hạ Long, Quảng Ninh"
        }
      ]
    },
    {
      province: "Quảng Trị",
      channels: [
        {
          name: "Công an tỉnh Quảng Trị (trực ban)",
          phone: "(0233) 3850 042",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "34 Hùng Vương, TP. Đông Hà, Quảng Trị"
        },
        {
          name: "Sở TT&TT Quảng Trị",
          phone: "(0233) 3851 888",
          email: "stttt@quangtri.gov.vn",
          reportLink: "Không có",
          address: "23 Hùng Vương, TP. Đông Hà, Quảng Trị"
        }
      ]
    },
    {
      province: "Sóc Trăng",
      channels: [
        {
          name: "Công an tỉnh Sóc Trăng (trực ban)",
          phone: "(0299) 3826 999",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "58 Tô Thị Huỳnh, P. 2, TP. Sóc Trăng, Sóc Trăng"
        },
        {
          name: "Sở TT&TT Sóc Trăng",
          phone: "(0299) 3827 797",
          email: "stttt@soctrang.gov.vn",
          reportLink: "Không có",
          address: "Số 18, Đường Trần Hưng Đạo, P. 2, TP. Sóc Trăng, Sóc Trăng"
        }
      ]
    },
    {
      province: "Sơn La",
      channels: [
        {
          name: "Công an tỉnh Sơn La (trực ban)",
          phone: "(0212) 3856 033",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Tổ 8, P. Quyết Thắng, TP. Sơn La, Sơn La"
        },
        {
          name: "Sở TT&TT Sơn La",
          phone: "(0212) 3856 880",
          email: "stttt@sonla.gov.vn",
          reportLink: "Không có",
          address: "Tỉnh ủy Sơn La, P. Tô Hiệu, TP. Sơn La, Sơn La"
        }
      ]
    },
    {
      province: "Tây Ninh",
      channels: [
        {
          name: "Công an tỉnh Tây Ninh (trực ban)",
          phone: "(0276) 3822 233",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "636 Cách Mạng Tháng Tám, P. Hiệp Ninh, TP. Tây Ninh, Tây Ninh"
        },
        {
          name: "Sở TT&TT Tây Ninh",
          phone: "(0276) 3824 777",
          email: "stttt@tayninh.gov.vn",
          reportLink: "Không có",
          address: "23 Hoàng Lê Kha, P. 3, TP. Tây Ninh, Tây Ninh"
        }
      ]
    },
    {
      province: "Thái Bình",
      channels: [
        {
          name: "Công an tỉnh Thái Bình (trực ban)",
          phone: "(0227) 3831 003",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Số 228 Hai Bà Trưng, P. Quang Trung, TP. Thái Bình, Thái Bình"
        },
        {
          name: "Sở TT&TT Thái Bình",
          phone: "(0227) 3831 960",
          email: "stttt@thaibinh.gov.vn",
          reportLink: "Không có",
          address: "79 Lê Lợi, P. Đề Thám, TP. Thái Bình, Thái Bình"
        }
      ]
    },
    {
      province: "Thái Nguyên",
      channels: [
        {
          name: "Công an tỉnh Thái Nguyên (trực ban)",
          phone: "(0208) 3855 313",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Phường Trưng Vương, TP. Thái Nguyên, Thái Nguyên"
        },
        {
          name: "Sở TT&TT Thái Nguyên",
          phone: "(0208) 3655 388",
          email: "sotttt@thainguyen.gov.vn",
          reportLink: "Không có",
          address: "Số 18, đường Nha Trang, P. Trưng Vương, TP. Thái Nguyên, Thái Nguyên"
        }
      ]
    },
    {
      province: "Thanh Hóa",
      channels: [
        {
          name: "Công an tỉnh Thanh Hóa (trực ban)",
          phone: "(0237) 3854 091",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "27 Nguyễn Trãi, P. Ba Đình, TP. Thanh Hóa, Thanh Hóa"
        },
        {
          name: "Sở TT&TT Thanh Hóa",
          phone: "(0237) 3851 688",
          email: "stttt@thanhhoa.gov.vn",
          reportLink: "Không có",
          address: "45 Đại lộ Lê Lợi, P. Lam Sơn, TP. Thanh Hóa, Thanh Hóa"
        }
      ]
    },
    {
      province: "Thừa Thiên Huế",
      channels: [
        {
          name: "Công an tỉnh Thừa Thiên Huế (trực ban)",
          phone: "(0234) 3824 242",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Số 01 Lê Lai, P. Vĩnh Ninh, TP. Huế, Thừa Thiên Huế"
        },
        {
          name: "Sở TT&TT Thừa Thiên Huế",
          phone: "(0234) 3813 511",
          email: "stttt@thuathienhue.gov.vn",
          reportLink: "Không có",
          address: "18 Lý Thường Kiệt, TP. Huế, Thừa Thiên Huế"
        }
      ]
    },
    {
      province: "Tiền Giang",
      channels: [
        {
          name: "Công an tỉnh Tiền Giang (trực ban)",
          phone: "(0273) 3873 234",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "56 Tôn Đức Thắng, P. 5, TP. Mỹ Tho, Tiền Giang"
        },
        {
          name: "Sở TT&TT Tiền Giang",
          phone: "(0273) 3872 446",
          email: "stttt@tiengiang.gov.vn",
          reportLink: "Không có",
          address: "43A Võ Duy Linh, P. 2, TP. Mỹ Tho, Tiền Giang"
        }
      ]
    },
    {
      province: "TP. Hồ Chí Minh",
      channels: [
        {
          name: "Công an TP. Hồ Chí Minh (Phòng ANM&PCTP CNC)",
          phone: "(028) 3838 7200",
          email: "catp@tphcm.gov.vn",
          reportLink: "Không có",
          address: "268 Trần Hưng Đạo, P. Nguyễn Cư Trinh, Q.1, TP. Hồ Chí Minh"
        },
        {
          name: "Sở TT&TT TP. Hồ Chí Minh",
          phone: "(028) 3520 2727",
          email: "stttt@tphcm.gov.vn",
          reportLink: "Không có",
          address: "59 Lý Tự Trọng, P. Bến Nghé, Q.1, TP. Hồ Chí Minh"
        }
      ]
    },
    {
      province: "Trà Vinh",
      channels: [
        {
          name: "Công an tỉnh Trà Vinh (trực ban)",
          phone: "(0294) 3851 304",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "06 Lý Tự Trọng, P. 1, TP. Trà Vinh, Trà Vinh"
        },
        {
          name: "Sở TT&TT Trà Vinh",
          phone: "(0294) 3851 717",
          email: "stttt@travinh.gov.vn",
          reportLink: "Không có",
          address: "04 Lê Thánh Tôn, P. 2, TP. Trà Vinh, Trà Vinh"
        }
      ]
    },
    {
      province: "Tuyên Quang",
      channels: [
        {
          name: "Công an tỉnh Tuyên Quang (trực ban)",
          phone: "(0207) 3822 060",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Phường Tân Quang, TP. Tuyên Quang, Tuyên Quang"
        },
        {
          name: "Sở TT&TT Tuyên Quang",
          phone: "(0207) 3750 888",
          email: "stttt@tuyenquang.gov.vn",
          reportLink: "Không có",
          address: "150 Trần Hưng Đạo, P. Minh Xuân, TP. Tuyên Quang, Tuyên Quang"
        }
      ]
    },
    {
      province: "Vĩnh Long",
      channels: [
        {
          name: "Công an tỉnh Vĩnh Long (trực ban)",
          phone: "(0270) 3823 155",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "99A Phạm Thái Bường, P. 4, TP. Vĩnh Long, Vĩnh Long"
        },
        {
          name: "Sở TT&TT Vĩnh Long",
          phone: "(0270) 3822 242",
          email: "sotttt@vinhlong.gov.vn",
          reportLink: "Không có",
          address: "12 Hoàng Thái Hiếu, P. 1, TP. Vĩnh Long, Vĩnh Long"
        }
      ]
    },
    {
      province: "Vĩnh Phúc",
      channels: [
        {
          name: "Công an tỉnh Vĩnh Phúc (trực ban)",
          phone: "(0211) 3862 144",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "Phường Liên Bảo, TP. Vĩnh Yên, Vĩnh Phúc"
        },
        {
          name: "Sở TT&TT Vĩnh Phúc",
          phone: "(0211) 3862 629",
          email: "sotttt@vinhphuc.gov.vn",
          reportLink: "Không có",
          address: "40 Nguyễn Trãi, P. Đống Đa, TP. Vĩnh Yên, Vĩnh Phúc"
        }
      ]
    },
    {
      province: "Yên Bái",
      channels: [
        {
          name: "Công an tỉnh Yên Bái (trực ban)",
          phone: "(0216) 3852 451",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "S. 725 Nguyễn Tất Thành, P. Đồng Tâm, TP. Yên Bái, Yên Bái"
        },
        {
          name: "Sở TT&TT Yên Bái",
          phone: "(0216) 3841 688",
          email: "stttt@yenbai.gov.vn",
          reportLink: "Không có",
          address: "Số 5, đường Đinh Tiên Hoàng, TP. Yên Bái, Yên Bái"
        }
      ]
    }
  ];

  // Helper function to safely render arrays
  const renderSafeArray = (arr: any[] | undefined, defaultArr: any[]) => {
    return (Array.isArray(arr) && arr.length > 0) ? arr : defaultArr;
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Nguồn lực báo cáo nội dung lừa đảo</h1>
      <div className="mb-6">
        <div className="flex items-center space-x-2 bg-background border rounded-md px-3 mb-4">
          <Search className="h-4 w-4 opacity-50" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm nguồn lực..." 
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="resources" className="w-full" onValueChange={(value) => setActiveDataSource(value as any)}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="resources">Nguồn lực</TabsTrigger>
            <TabsTrigger value="local">Việt Nam</TabsTrigger>
            <TabsTrigger value="asian">Châu Á</TabsTrigger>
            <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
            <TabsTrigger value="international">Quốc tế</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <div className="grid gap-6 md:grid-cols-1">
              {renderSafeArray(filteredItems, resourceCategories).length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {renderSafeArray(filteredItems, resourceCategories).map((category: ResourceCategory, index: number) => (
                    <AccordionItem key={category.id || index} value={category.id || `category-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-4 text-muted-foreground">{category.description}</p>
                        <div className="space-y-4">
                          {category.resources && category.resources.map((resource, idx) => (
                            <Card key={idx}>
                              <CardHeader>
                                <CardTitle>
                                  {resource.url ? (
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                                      {resource.name} <Globe className="h-4 w-4" />
                                    </a>
                                  ) : (
                                    resource.name
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground">{resource.description}</p>
                                {resource.email && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${resource.email}`} className="text-primary hover:underline">
                                      {resource.email}
                                    </a>
                                  </div>
                                )}
                                {resource.phone && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{resource.phone}</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp. Vui lòng thử từ khóa khác.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="local">
            <div className="space-y-4">
              <div className="mb-4">
                <Select 
                  value={selectedProvince || ""}
                  onValueChange={(value) => setSelectedProvince(value)}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[400px]">
                      {vietnamLocalContacts.map((province) => (
                        <SelectItem key={province.province} value={province.province}>
                          {province.province}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {(selectedProvince 
                  ? vietnamLocalContacts.filter(p => p.province === selectedProvince)
                  : renderSafeArray(filteredItems, vietnamLocalContacts)
                ).map((province) => (
                  <Card key={province.province}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" /> {province.province}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {province.channels && province.channels.map((channel, idx) => (
                        <div key={idx} className="border-t pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
                          <h3 className="font-medium mb-2">{channel.name}</h3>
                          <div className="grid gap-2 text-sm">
                            <div className="flex gap-2 items-start">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span>{channel.address}</span>
                            </div>
                            <div className="flex gap-2 items-start">
                              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span>{channel.phone}</span>
                            </div>
                            <div className="flex gap-2 items-start">
                              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span>{channel.email}</span>
                            </div>
                            {channel.reportLink !== "Không có" && (
                              <div className="flex gap-2 items-start">
                                <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <span>{channel.reportLink}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="asian">
            <Card>
              <CardHeader>
                <CardTitle>Cơ quan hỗ trợ tại các quốc gia châu Á</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quốc gia</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Trang báo cáo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderSafeArray(filteredItems, asianCountries).map((country: CountryContact) => (
                      <TableRow key={country.country}>
                        <TableCell className="font-medium">{country.country}</TableCell>
                        <TableCell>{country.phone}</TableCell>
                        <TableCell>{country.email}</TableCell>
                        <TableCell>
                          {country.reportLink?.startsWith("http") ? (
                            <a href={country.reportLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Truy cập
                            </a>
                          ) : (
                            country.reportLink
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="english">
            <Card>
              <CardHeader>
                <CardTitle>Cơ quan hỗ trợ tại các quốc gia nói tiếng Anh</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quốc gia</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Trang báo cáo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderSafeArray(filteredItems, englishSpeakingCountries).map((country: CountryContact) => (
                      <TableRow key={country.country}>
                        <TableCell className="font-medium">{country.country}</TableCell>
                        <TableCell>{country.phone}</TableCell>
                        <TableCell>{country.email}</TableCell>
                        <TableCell>
                          {country.reportLink?.startsWith("http") ? (
                            <a href={country.reportLink.split("\n")[0]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Truy cập
                            </a>
                          ) : (
                            country.reportLink
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="international">
            <Card>
              <CardHeader>
                <CardTitle>Tổ chức quốc tế</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tổ chức</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Trang báo cáo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderSafeArray(filteredItems, internationalOrganizations).map((org: InternationalOrg) => (
                      <TableRow key={org.organization}>
                        <TableCell className="font-medium">{org.organization}</TableCell>
                        <TableCell>{org.phone}</TableCell>
                        <TableCell>{org.email}</TableCell>
                        <TableCell>
                          {org.reportLink?.startsWith("http") ? (
                            <a href={org.reportLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Truy cập
                            </a>
                          ) : (
                            org.reportLink
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportingResourcesSection;

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

  // Vietnamese provinces contacts - updated with all provinces
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
          phone: "(0260) 3862 138",
          email: "Không có thông tin",
          reportLink: "Không có",
          address: "254 Trần Phú, TP. Kon Tum, Kon Tum"
        },
        {
          name: "Sở TT&TT Kon Tum",
          phone: "(0260) 3866 405",
          email: "stttt@kontum.gov.vn",
          reportLink: "Không có",
          address: "250 Trần Phú, TP. Kon Tum, Kon Tum"
        }
      ]
    },
    {
      province: "Lai Châu",
      channels: [
        {
          name: "Công an tỉnh Lai Châu (Phòng ANM&PCTP CNC)",
          phone: "(0213) 3876 527",
          email: "congan@laichau.gov.vn",
          reportLink: "Facebook: fb.com/Congantinhlaichau",
          address: "Tổ 16, P. Tân Phong, TP. Lai Châu, Lai Châu"
        },
        {
          name: "Sở TT&TT Lai Châu",
          phone: "(0213) 3799 898",
          email: "stttt@laichau.gov.vn",
          reportLink: "Không có",
          address: "190 Trần Phú, P. Tân Phong, TP. Lai Châu, Lai Châu"
        }
      ]
    },
    {
      province: "Lâm Đồng",
      channels: [
        {
          name: "Công an tỉnh Lâm Đồng (đường dây nóng)",
          phone: "0263.822.097\n0693.446.109",
          email: "ca@lamdong.gov.vn",
          reportLink: "Không có",
          address: "04 Trần Bình Trọng, P. 5, TP. Đà Lạt, Lâm Đồng"
        },

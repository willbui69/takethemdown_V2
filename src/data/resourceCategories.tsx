
import { Shield, Building, Flag } from "lucide-react";
import { ResourceCategory } from "@/types/reportingResources";

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

export default resourceCategories;


import { FileText } from "lucide-react";
import { BlogPost } from "@/types/blog";

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Phát hiện và gỡ bỏ website giả mạo ngân hàng",
    excerpt: "Take Them Down đã hỗ trợ phát hiện và gỡ bỏ thành công một website giả mạo ngân hàng lớn tại Việt Nam...",
    date: "2024-04-15",
    slug: "phat-hien-go-bo-website-gia-mao-ngan-hang"
  },
  {
    id: 2,
    title: "Cảnh báo chiêu thức lừa đảo mới trên Facebook",
    excerpt: "Những thủ đoạn lừa đảo mới được phát hiện trên Facebook đang nhắm vào người dùng Việt Nam...",
    date: "2024-04-10",
    slug: "canh-bao-chieu-thuc-lua-dao-moi-tren-facebook"
  },
  {
    id: 3,
    title: "Bảo vệ thông tin cá nhân trước nguy cơ rò rỉ dữ liệu",
    excerpt: "Hướng dẫn các biện pháp bảo vệ thông tin cá nhân và cách xử lý khi bị rò rỉ dữ liệu...",
    date: "2024-04-05",
    slug: "bao-ve-thong-tin-ca-nhan-truoc-nguy-co-ro-ri-du-lieu"
  }
];

const BlogList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogPosts.map((post) => (
        <article 
          key={post.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center gap-2 text-security mb-3">
              <FileText className="h-5 w-5" />
              <time className="text-sm">{post.date}</time>
            </div>
            <h2 className="text-xl font-semibold mb-3 hover:text-security transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {post.excerpt}
            </p>
            <button className="text-security hover:text-security-light font-medium transition-colors">
              Đọc thêm →
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;


import RootLayout from "@/components/layout/RootLayout";
import BlogList from "@/components/blog/BlogList";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

const Blog = () => {
  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Blog</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="text-3xl font-bold mt-6 mb-8">Tin tức & Cảnh báo</h1>
        <BlogList />
      </div>
    </RootLayout>
  );
};

export default Blog;

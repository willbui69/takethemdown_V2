
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToSection = (id: string) => {
    // If we're on the home page, scroll to the section
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we're on another page, navigate to home and then scroll to section
      navigate(`/#${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-security" />
            <span className="font-bold text-lg md:text-xl text-security">Take Them Down</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-security font-medium transition-colors">
              Trang chủ
            </Link>
            <button 
              onClick={() => scrollToSection("services")} 
              className="text-gray-700 hover:text-security font-medium transition-colors"
            >
              Dịch vụ
            </button>
            <button 
              onClick={() => scrollToSection("process")} 
              className="text-gray-700 hover:text-security font-medium transition-colors"
            >
              Quy trình
            </button>
            <button 
              onClick={() => scrollToSection("faq")} 
              className="text-gray-700 hover:text-security font-medium transition-colors"
            >
              Câu hỏi
            </button>
            <Link 
              to="/reporting" 
              className="text-gray-700 hover:text-security font-medium transition-colors"
            >
              Báo cáo
            </Link>
            <Link 
              to="/ransomware" 
              className="text-gray-700 hover:text-security font-medium transition-colors"
            >
              Mã độc tống tiền
            </Link>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="bg-security text-white px-4 py-2 rounded-md hover:bg-security-light transition-colors"
            >
              Gửi yêu cầu hỗ trợ
            </button>
          </nav>
          <button 
            className="md:hidden text-gray-700 p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <main>
        {children}
      </main>

      <footer className="bg-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-security" />
              <span className="font-bold">Take Them Down</span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Take Them Down - Dự án phi lợi nhuận
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;

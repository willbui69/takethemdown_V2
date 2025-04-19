
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isVisible && !isOpen) return null;
  
  const scrollToSection = (id: string) => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div 
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-white shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-bold text-lg text-security">Menu</h3>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="block py-2 text-gray-700 hover:text-security font-medium"
                onClick={onClose}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <button 
                className="block w-full text-left py-2 text-gray-700 hover:text-security font-medium"
                onClick={() => scrollToSection("services")}
              >
                Dịch vụ
              </button>
            </li>
            <li>
              <button 
                className="block w-full text-left py-2 text-gray-700 hover:text-security font-medium"
                onClick={() => scrollToSection("process")}
              >
                Quy trình
              </button>
            </li>
            <li>
              <button 
                className="block w-full text-left py-2 text-gray-700 hover:text-security font-medium"
                onClick={() => scrollToSection("faq")}
              >
                Câu hỏi
              </button>
            </li>
            <li>
              <button 
                className="block w-full text-left py-2 text-gray-700 hover:text-security font-medium"
                onClick={() => scrollToSection("contact")}
              >
                Liên hệ
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button 
            className="w-full bg-security text-white py-2 rounded-md hover:bg-security-light transition-colors"
            onClick={() => scrollToSection("contact")}
          >
            Gửi yêu cầu hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

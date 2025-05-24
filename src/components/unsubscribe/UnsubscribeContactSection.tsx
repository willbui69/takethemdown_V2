
interface UnsubscribeContactSectionProps {
  isSuccess: boolean;
}

export const UnsubscribeContactSection = ({ isSuccess }: UnsubscribeContactSectionProps) => {
  if (!isSuccess) return null;

  return (
    <div className="mt-8 text-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Cần hỗ trợ thêm?
        </h3>
        <p className="text-gray-600 mb-4">
          Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi.
        </p>
        <a 
          href="mailto:lienhe@takethemdown.com.vn"
          className="text-security hover:text-security-light font-medium underline"
        >
          lienhe@takethemdown.com.vn
        </a>
      </div>
    </div>
  );
};

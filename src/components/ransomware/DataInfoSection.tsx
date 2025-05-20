
export const DataInfoSection = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">Về Dữ Liệu Này</h3>
      <p className="text-gray-700 mb-4">
        Dữ liệu này được lấy từ ransomware.live, trang theo dõi các nhóm ransomware và nạn nhân của họ.
        Thông tin được cập nhật tự động mỗi 4 giờ để cung cấp tổng quan mới nhất về hoạt động ransomware.
      </p>
      <p className="text-gray-700">
        Đăng ký để nhận thông báo qua email khi có nạn nhân mới được thêm vào cơ sở dữ liệu. 
        Bạn có thể chọn nhận thông báo về nạn nhân từ tất cả các quốc gia hoặc chỉ chọn các quốc gia quan tâm.
      </p>
    </div>
  );
};

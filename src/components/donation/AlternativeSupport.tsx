
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Coffee } from "lucide-react";

const AlternativeSupport = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Các cách khác để hỗ trợ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Users className="h-5 w-5 text-security" />
          <span className="text-sm">Chia sẻ trang web với bạn bè</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Shield className="h-5 w-5 text-security" />
          <span className="text-sm">Báo cáo các trang web lừa đảo</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Coffee className="h-5 w-5 text-security" />
          <span className="text-sm">Tham gia cộng đồng tình nguyện</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeSupport;

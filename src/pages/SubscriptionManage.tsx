
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";
import { CircleCheck, CircleX, CircleAlert } from "lucide-react";

const SubscriptionManage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifySubscription, unsubscribe, loading } = useSubscription();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verifyToken = params.get("verify");
    const unsubToken = params.get("unsubscribe");
    
    const processRequest = async () => {
      try {
        if (verifyToken) {
          const result = await verifySubscription(verifyToken);
          if (result) {
            setStatus("success");
            setMessage("Đăng ký của bạn đã được xác nhận thành công. Bây giờ bạn sẽ nhận được cảnh báo về ransomware.");
          } else {
            setStatus("error");
            setMessage("Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử đăng ký lại.");
          }
        } else if (unsubToken) {
          const result = await unsubscribe(unsubToken);
          if (result) {
            setStatus("success");
            setMessage("Bạn đã hủy đăng ký thành công. Bạn sẽ không nhận được thông báo về ransomware nữa.");
          } else {
            setStatus("error");
            setMessage("Mã hủy đăng ký không hợp lệ hoặc đã hết hạn.");
          }
        } else {
          setStatus("error");
          setMessage("Yêu cầu không hợp lệ. Thiếu mã xác nhận hoặc mã hủy đăng ký.");
        }
      } catch (error) {
        console.error("Error processing subscription request:", error);
        setStatus("error");
        setMessage("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
      }
    };
    
    processRequest();
  }, [location.search, verifySubscription, unsubscribe]);

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Quản Lý Đăng Ký
            </CardTitle>
            <CardDescription className="text-center">
              Quản lý thông báo cảnh báo ransomware của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            {loading || status === "loading" ? (
              <div className="text-center">
                <CircleAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <p>Đang xử lý yêu cầu của bạn...</p>
              </div>
            ) : status === "success" ? (
              <div className="text-center">
                <CircleCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p>{message}</p>
              </div>
            ) : (
              <div className="text-center">
                <CircleX className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p>{message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/ransomware")}>
              Quay Lại Trang Giám Sát
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RootLayout>
  );
};

export default SubscriptionManage;

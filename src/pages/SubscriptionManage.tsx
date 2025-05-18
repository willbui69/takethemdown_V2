
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
            setMessage("Your subscription has been successfully verified. You will now receive ransomware alerts.");
          } else {
            setStatus("error");
            setMessage("Invalid or expired verification token. Please try subscribing again.");
          }
        } else if (unsubToken) {
          const result = await unsubscribe(unsubToken);
          if (result) {
            setStatus("success");
            setMessage("You have been successfully unsubscribed. You will no longer receive ransomware alerts.");
          } else {
            setStatus("error");
            setMessage("Invalid or expired unsubscribe token.");
          }
        } else {
          setStatus("error");
          setMessage("Invalid request. Missing verification or unsubscribe token.");
        }
      } catch (error) {
        console.error("Error processing subscription request:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
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
              Subscription Management
            </CardTitle>
            <CardDescription className="text-center">
              Manage your ransomware alert notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            {loading || status === "loading" ? (
              <div className="text-center">
                <CircleAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <p>Processing your request...</p>
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
              Return to Monitoring Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RootLayout>
  );
};

export default SubscriptionManage;

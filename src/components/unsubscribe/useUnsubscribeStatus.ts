
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type UnsubscribeStatus = "loading" | "success" | "already-unsubscribed" | "error" | "invalid" | "not-found";

export const useUnsubscribeStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState<UnsubscribeStatus>("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    const emailParam = params.get("email");
    
    if (statusParam) {
      setStatus(statusParam as UnsubscribeStatus);
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    } else {
      setStatus("invalid");
    }
  }, [location.search]);

  return { status, email };
};

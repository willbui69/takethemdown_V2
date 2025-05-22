
import { AlertTriangle } from "lucide-react";

interface EmptyOrErrorStateProps {
  message: string;
  loading: boolean;
  isEmpty: boolean;
}

export const EmptyOrErrorState = ({ 
  message, 
  loading, 
  isEmpty 
}: EmptyOrErrorStateProps) => {
  if (loading || !isEmpty) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <p className="text-amber-700">{message}</p>
    </div>
  );
};

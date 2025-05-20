
import { GroupStatistics } from "@/components/ransomware/GroupStatistics";
import { SubscriptionForm } from "@/components/ransomware/SubscriptionForm";

export const StatsAndSubscriptionSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="md:col-span-2">
        <GroupStatistics />
      </div>
      <div>
        <SubscriptionForm />
      </div>
    </div>
  );
};

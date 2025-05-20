
import { useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { AdminPanel } from "@/components/ransomware/AdminPanel";
import { useRansomwareData } from "@/components/ransomware/RansomwareContainer";
import { RansomwareHeader } from "@/components/ransomware/RansomwareHeader";
import { GeoBlockAlert } from "@/components/ransomware/GeoBlockAlert";
import { StatsAndSubscriptionSection } from "@/components/ransomware/StatsAndSubscriptionSection";
import { VictimsDataTabs } from "@/components/ransomware/VictimsDataTabs";
import { DataInfoSection } from "@/components/ransomware/DataInfoSection";

const RansomwareMonitor = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { 
    victims, 
    recentVictims, 
    loading, 
    error, 
    isGeoBlocked,
    lastUpdated,
    loadData
  } = useRansomwareData();

  const toggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);

  return (
    <RootLayout>
      <SubscriptionProvider>
        <div className="container mx-auto px-4 py-8">
          <RansomwareHeader
            lastUpdated={lastUpdated}
            loading={loading}
            onRefresh={loadData}
            showAdminPanel={showAdminPanel}
            toggleAdminPanel={toggleAdminPanel}
          />

          {isGeoBlocked && <GeoBlockAlert />}

          {showAdminPanel && (
            <div className="mb-8">
              <AdminPanel />
            </div>
          )}

          <StatsAndSubscriptionSection />

          <VictimsDataTabs
            victims={victims}
            recentVictims={recentVictims}
            loading={loading}
            error={error}
          />

          <DataInfoSection />
        </div>
      </SubscriptionProvider>
    </RootLayout>
  );
};

export default RansomwareMonitor;

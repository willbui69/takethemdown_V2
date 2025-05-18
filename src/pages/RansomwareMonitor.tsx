
import { useEffect, useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { VictimsTable } from "@/components/ransomware/VictimsTable";
import { GroupStatistics } from "@/components/ransomware/GroupStatistics";
import { SubscriptionForm } from "@/components/ransomware/SubscriptionForm";
import { AdminPanel } from "@/components/ransomware/AdminPanel";
import { fetchAllVictims, fetchRecentVictims } from "@/services/ransomwareAPI";
import { RansomwareVictim } from "@/types/ransomware";
import { CirclePlus, CircleMinus } from "lucide-react";

const RansomwareMonitor = () => {
  const [victims, setVictims] = useState<RansomwareVictim[]>([]);
  const [recentVictims, setRecentVictims] = useState<RansomwareVictim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [allVictims, todayVictims] = await Promise.all([
          fetchAllVictims(),
          fetchRecentVictims()
        ]);
        
        setVictims(allVictims);
        setRecentVictims(todayVictims);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load ransomware data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <RootLayout>
      <SubscriptionProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-security">Ransomware Monitoring</h1>
              <p className="text-gray-600">
                Track ransomware victim data and get alerts on new victims
              </p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              {showAdminPanel ? (
                <>
                  <CircleMinus className="h-4 w-4" /> Hide Admin Panel
                </>
              ) : (
                <>
                  <CirclePlus className="h-4 w-4" /> Show Admin Panel
                </>
              )}
            </Button>
          </div>

          {showAdminPanel && (
            <div className="mb-8">
              <AdminPanel />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <GroupStatistics />
            </div>
            <div>
              <SubscriptionForm />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Victims</TabsTrigger>
                <TabsTrigger value="recent">Recent (24h)</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-4">
                {error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <VictimsTable 
                    victims={victims} 
                    loading={loading} 
                  />
                )}
              </TabsContent>
              <TabsContent value="recent" className="pt-4">
                {error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <VictimsTable 
                    victims={recentVictims} 
                    loading={loading} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">About This Data</h3>
            <p className="text-gray-700 mb-4">
              This data is sourced from ransomware.live, which tracks ransomware groups and their victims.
              The information is updated regularly to provide the most current overview of ransomware activity.
            </p>
            <p className="text-gray-700">
              Subscribe to receive email notifications when new victims are added to the database.
            </p>
          </div>
        </div>
      </SubscriptionProvider>
    </RootLayout>
  );
};

export default RansomwareMonitor;

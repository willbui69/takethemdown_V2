
import { useEffect, useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { VictimsTable } from "@/components/ransomware/VictimsTable";
import { GroupStatistics } from "@/components/ransomware/GroupStatistics";
import { SubscriptionForm } from "@/components/ransomware/SubscriptionForm";
import { AdminPanel } from "@/components/ransomware/AdminPanel";
import { checkApiAvailability, fetchAllVictims, fetchRecentVictims } from "@/services/ransomwareAPI";
import { RansomwareVictim } from "@/types/ransomware";
import { CirclePlus, CircleMinus, Database, Bug, ShieldAlert, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RansomwareMonitor = () => {
  const [victims, setVictims] = useState<RansomwareVictim[]>([]);
  const [recentVictims, setRecentVictims] = useState<RansomwareVictim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGeoBlocked(false);
      
      // First check API availability
      const isAvailable = await checkApiAvailability();
      
      if (!isAvailable) {
        setError("The ransomware.live API is currently unavailable.");
        setLoading(false);
        return;
      }
      
      // Using Promise.allSettled to continue even if one promise fails
      const [allVictimsResult, todayVictimsResult] = await Promise.allSettled([
        fetchAllVictims(),
        fetchRecentVictims()
      ]);
      
      if (allVictimsResult.status === 'fulfilled') {
        setVictims(allVictimsResult.value);
      } else {
        console.error("Error fetching all victims:", allVictimsResult.reason);
        
        // Check if it's a geographic block
        if (allVictimsResult.reason instanceof Error && 
            allVictimsResult.reason.message.includes("Geographic restriction")) {
          setIsGeoBlocked(true);
          setError("Your location is restricted from accessing ransomware.live data.");
        } else {
          setError("Failed to load all victims data.");
        }
      }
      
      if (todayVictimsResult.status === 'fulfilled') {
        setRecentVictims(todayVictimsResult.value);
      } else {
        console.error("Error fetching recent victims:", todayVictimsResult.reason);
        
        // Only set error if not already set and not a geo-block (which we've already handled)
        if (!isGeoBlocked && !error) {
          setError("Failed to load recent victims data.");
        }
      }
      
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load ransomware data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data when component mounts
    loadData();
    
    // Set up 4-hour refresh interval
    const intervalId = setInterval(() => {
      console.log("Executing 4-hour scheduled data update");
      loadData();
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    
    return () => clearInterval(intervalId);
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
                {lastUpdated && (
                  <span className="text-sm text-gray-500 ml-2">
                    Last updated: {lastUpdated.toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={loadData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
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
          </div>

          {isGeoBlocked && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Geographic Restriction</AlertTitle>
              <AlertDescription>
                Your location is blocked from accessing the ransomware.live API. This may be due to country-specific restrictions enforced by the API provider.
              </AlertDescription>
            </Alert>
          )}

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
                  <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
                    <Bug className="h-10 w-10" />
                    {error}
                  </div>
                ) : (
                  <VictimsTable 
                    victims={victims} 
                    loading={loading} 
                  />
                )}
              </TabsContent>
              <TabsContent value="recent" className="pt-4">
                {error ? (
                  <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
                    <Bug className="h-10 w-10" />
                    {error}
                  </div>
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
              The information is updated automatically every 4 hours to provide the most current overview of ransomware activity.
            </p>
            <p className="text-gray-700">
              Subscribe to receive email notifications when new victims are added to the database. 
              You can choose to be notified about victims from all countries or select specific countries of interest.
            </p>
          </div>
        </div>
      </SubscriptionProvider>
    </RootLayout>
  );
};

export default RansomwareMonitor;

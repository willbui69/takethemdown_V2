
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubscription } from "@/context/SubscriptionContext";
import { Subscription, FetchHistory } from "@/types/ransomware";
import { fetchAllVictims } from "@/services/ransomwareAPI";
import { toast } from "@/components/ui/sonner";

export const AdminPanel = () => {
  const { subscriptions } = useSubscription();
  const [fetchHistory, setFetchHistory] = useState<FetchHistory[]>([]);
  const [fetching, setFetching] = useState(false);
  
  const triggerFetch = async () => {
    if (fetching) return;
    
    setFetching(true);
    
    try {
      toast.info("Fetching latest victim data...");
      
      // Get previous victim data (in a real app this would be from database)
      const previousVictims = localStorage.getItem("previousVictims");
      
      // Fetch new victims
      const newVictims = await fetchAllVictims();
      
      // Save to localStorage (in a real app, we'd save to a database)
      localStorage.setItem("previousVictims", JSON.stringify(newVictims));
      
      let newCount = 0;
      
      if (previousVictims) {
        const oldVictimsMap = new Map();
        JSON.parse(previousVictims).forEach((victim: any) => {
          oldVictimsMap.set(`${victim.group_name}-${victim.victim_name}`, true);
        });
        
        // Count new victims
        newVictims.forEach((victim) => {
          if (!oldVictimsMap.has(`${victim.group_name}-${victim.victim_name}`)) {
            newCount++;
          }
        });
      }
      
      // Create fetch history entry
      const newHistory: FetchHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        totalCount: newVictims.length,
        newCount,
        successful: true,
      };
      
      setFetchHistory(prev => [newHistory, ...prev]);
      
      if (newCount > 0) {
        toast.success(`Found ${newCount} new victims!`);
        // In a real app, we would send notifications here
        console.log(`Would send notification email about ${newCount} new victims`);
      } else {
        toast.info("No new victims found");
      }
      
    } catch (error) {
      console.error("Error during victim fetch:", error);
      
      const errorHistory: FetchHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        totalCount: 0,
        newCount: 0,
        successful: false,
        error: String(error),
      };
      
      setFetchHistory(prev => [errorHistory, ...prev]);
      toast.error("Failed to fetch victim data");
      
    } finally {
      setFetching(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Admin Controls</h3>
        <Button 
          onClick={triggerFetch} 
          disabled={fetching}
          className="mb-6"
        >
          {fetching ? "Fetching Data..." : "Trigger Data Fetch"}
        </Button>
        
        <h4 className="font-medium mb-2">Fetch History</h4>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Victims</TableHead>
                <TableHead>New Victims</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No fetch history yet
                  </TableCell>
                </TableRow>
              ) : (
                fetchHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.timestamp)}</TableCell>
                    <TableCell>
                      {entry.successful ? (
                        <span className="text-green-600">Success</span>
                      ) : (
                        <span className="text-red-600" title={entry.error}>Failed</span>
                      )}
                    </TableCell>
                    <TableCell>{entry.totalCount}</TableCell>
                    <TableCell>{entry.newCount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Subscribers</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No subscribers yet
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub: Subscription) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>
                      {sub.verified ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(sub.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

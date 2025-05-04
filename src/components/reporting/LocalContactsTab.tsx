
import { useState } from "react";
import { LocalContact } from "@/types/reportingResources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

interface LocalContactsTabProps {
  filteredItems: LocalContact[];
  defaultItems: LocalContact[];
}

const LocalContactsTab = ({ filteredItems, defaultItems }: LocalContactsTabProps) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Helper function to safely render arrays
  const renderSafeArray = (arr: LocalContact[] | undefined, defaultArr: LocalContact[]) => {
    return (Array.isArray(arr) && arr.length > 0) ? arr : defaultArr;
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Select 
          value={selectedProvince || ""}
          onValueChange={(value) => setSelectedProvince(value)}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[400px]">
              {defaultItems.map((province) => (
                <SelectItem key={province.province} value={province.province}>
                  {province.province}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {(selectedProvince 
          ? defaultItems.filter(p => p.province === selectedProvince)
          : renderSafeArray(filteredItems, defaultItems)
        ).map((province) => (
          <Card key={province.province}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> {province.province}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {province.channels && province.channels.map((channel, idx) => (
                <div key={idx} className="border-t pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
                  <h3 className="font-medium mb-2">{channel.name}</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex gap-2 items-start">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{channel.address}</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{channel.phone}</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{channel.email}</span>
                    </div>
                    {channel.reportLink !== "Không có" && (
                      <div className="flex gap-2 items-start">
                        <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>{channel.reportLink}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocalContactsTab;

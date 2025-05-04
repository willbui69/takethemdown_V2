import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// Import data
import resourceCategories from "@/data/resourceCategories";
import vietnamLocalContacts from "@/data/vietnamLocalContacts";
import asianCountries from "@/data/asianCountries";
import englishSpeakingCountries from "@/data/englishSpeakingCountries";
import internationalOrganizations from "@/data/internationalOrganizations";

// Import components
import ResourcesTab from "@/components/reporting/ResourcesTab";
import LocalContactsTab from "@/components/reporting/LocalContactsTab";
import CountryContactsTable from "@/components/reporting/CountryContactsTable";
import OrganizationsTable from "@/components/reporting/OrganizationsTable";

// Import types
import { ResourceCategory, LocalContact, CountryContact, InternationalOrg } from "@/types/reportingResources";

const ReportingResourcesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [activeDataSource, setActiveDataSource] = useState<'resources' | 'local' | 'asian' | 'english' | 'international'>('resources');

  useEffect(() => {
    // Initialize default values before any filtering
    let initialItems: any[] = [];
    switch (activeDataSource) {
      case 'asian':
        initialItems = [...asianCountries];
        break;
      case 'english':
        initialItems = [...englishSpeakingCountries];
        break;
      case 'international':
        initialItems = [...internationalOrganizations];
        break;
      case 'local':
        initialItems = [...vietnamLocalContacts];
        break;
      case 'resources':
      default:
        initialItems = [...resourceCategories];
        break;
    }
    
    // Filter data based on the active tab and search query
    if (searchQuery.trim()) {
      switch (activeDataSource) {
        case 'asian':
          setFilteredItems(asianCountries.filter(country => 
            country.country.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'english':
          setFilteredItems(englishSpeakingCountries.filter(country => 
            country.country.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'international':
          setFilteredItems(internationalOrganizations.filter(org => 
            org.organization.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'local':
          setFilteredItems(vietnamLocalContacts.filter(province => 
            province.province.toLowerCase().includes(searchQuery.toLowerCase())
          ));
          break;
        case 'resources':
        default:
          const filteredCategories = [...resourceCategories];
          // Filter the resources within each category
          filteredCategories.forEach(category => {
            category.resources = category.resources.filter(resource => 
              resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
          });
          // Only keep categories that have matching resources
          setFilteredItems(filteredCategories.filter(category => category.resources.length > 0));
          break;
      }
    } else {
      // If no search query, show all items
      setFilteredItems(initialItems);
    }
  }, [searchQuery, activeDataSource]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Nguồn lực báo cáo nội dung lừa đảo</h1>
      <div className="mb-6">
        <div className="flex items-center space-x-2 bg-background border rounded-md px-3 mb-4">
          <Search className="h-4 w-4 opacity-50" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm nguồn lực..." 
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="resources" className="w-full" onValueChange={(value) => setActiveDataSource(value as any)}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="resources">Nguồn lực</TabsTrigger>
            <TabsTrigger value="local">Việt Nam</TabsTrigger>
            <TabsTrigger value="asian">Châu Á</TabsTrigger>
            <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
            <TabsTrigger value="international">Quốc tế</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <ResourcesTab 
              filteredItems={filteredItems as ResourceCategory[]} 
              defaultItems={resourceCategories} 
            />
          </TabsContent>

          <TabsContent value="local">
            <LocalContactsTab 
              filteredItems={filteredItems as LocalContact[]} 
              defaultItems={vietnamLocalContacts} 
            />
          </TabsContent>
          
          <TabsContent value="asian">
            <CountryContactsTable 
              title="Cơ quan hỗ trợ tại các quốc gia châu Á" 
              filteredItems={filteredItems as CountryContact[]} 
              defaultItems={asianCountries} 
            />
          </TabsContent>

          <TabsContent value="english">
            <CountryContactsTable 
              title="Cơ quan hỗ trợ tại các quốc gia nói tiếng Anh" 
              filteredItems={filteredItems as CountryContact[]} 
              defaultItems={englishSpeakingCountries} 
            />
          </TabsContent>

          <TabsContent value="international">
            <OrganizationsTable 
              title="Tổ chức quốc tế" 
              filteredItems={filteredItems as InternationalOrg[]} 
              defaultItems={internationalOrganizations} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportingResourcesSection;

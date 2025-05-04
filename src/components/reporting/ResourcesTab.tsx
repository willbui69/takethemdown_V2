
import { useState, useEffect } from "react";
import { ResourceCategory } from "@/types/reportingResources";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Mail, Phone } from "lucide-react";

interface ResourcesTabProps {
  filteredItems: ResourceCategory[];
  defaultItems: ResourceCategory[];
}

const ResourcesTab = ({ filteredItems, defaultItems }: ResourcesTabProps) => {
  // Helper function to safely render arrays
  const renderSafeArray = (arr: ResourceCategory[] | undefined, defaultArr: ResourceCategory[]) => {
    return (Array.isArray(arr) && arr.length > 0) ? arr : defaultArr;
  };

  return (
    <div className="grid gap-6 md:grid-cols-1">
      {renderSafeArray(filteredItems, defaultItems).length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {renderSafeArray(filteredItems, defaultItems).map((category: ResourceCategory, index: number) => (
            <AccordionItem key={category.id || index} value={category.id || `category-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-4 text-muted-foreground">{category.description}</p>
                <div className="space-y-4">
                  {category.resources && category.resources.map((resource, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle>
                          {resource.url ? (
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                              {resource.name} <Globe className="h-4 w-4" />
                            </a>
                          ) : (
                            resource.name
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{resource.description}</p>
                        {resource.email && (
                          <div className="flex items-center gap-2 mt-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${resource.email}`} className="text-primary hover:underline">
                              {resource.email}
                            </a>
                          </div>
                        )}
                        {resource.phone && (
                          <div className="flex items-center gap-2 mt-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{resource.phone}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp. Vui lòng thử từ khóa khác.</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;

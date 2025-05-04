
import { InternationalOrg } from "@/types/reportingResources";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrganizationsTableProps {
  title: string;
  filteredItems: InternationalOrg[];
  defaultItems: InternationalOrg[];
}

const OrganizationsTable = ({ title, filteredItems, defaultItems }: OrganizationsTableProps) => {
  // Helper function to safely render arrays
  const renderSafeArray = (arr: InternationalOrg[] | undefined, defaultArr: InternationalOrg[]) => {
    return (Array.isArray(arr) && arr.length > 0) ? arr : defaultArr;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tổ chức</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trang báo cáo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderSafeArray(filteredItems, defaultItems).map((org: InternationalOrg) => (
              <TableRow key={org.organization}>
                <TableCell className="font-medium">{org.organization}</TableCell>
                <TableCell>{org.phone}</TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>
                  {org.reportLink?.startsWith("http") ? (
                    <a href={org.reportLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Truy cập
                    </a>
                  ) : (
                    org.reportLink
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrganizationsTable;

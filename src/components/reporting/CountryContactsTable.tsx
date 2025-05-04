
import { CountryContact } from "@/types/reportingResources";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountryContactsTableProps {
  title: string;
  filteredItems: CountryContact[];
  defaultItems: CountryContact[];
}

const CountryContactsTable = ({ title, filteredItems, defaultItems }: CountryContactsTableProps) => {
  // Helper function to safely render arrays
  const renderSafeArray = (arr: CountryContact[] | undefined, defaultArr: CountryContact[]) => {
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
              <TableHead>Quốc gia</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trang báo cáo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderSafeArray(filteredItems, defaultItems).map((country: CountryContact) => (
              <TableRow key={country.country}>
                <TableCell className="font-medium">{country.country}</TableCell>
                <TableCell>{country.phone}</TableCell>
                <TableCell>{country.email}</TableCell>
                <TableCell>
                  {country.reportLink?.startsWith("http") ? (
                    <a href={country.reportLink.split("\n")[0]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Truy cập
                    </a>
                  ) : (
                    country.reportLink
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

export default CountryContactsTable;

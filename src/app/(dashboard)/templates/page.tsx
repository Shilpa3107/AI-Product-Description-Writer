import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const templates = [
    {
        name: "Ergonomic Chair Launch",
        product: "Ergonomic Office Chair",
        status: "Active",
        lastModified: "2023-06-23",
    },
    {
        name: "Winter Headphone Sale",
        product: "Noise-Cancelling Headphones",
        status: "Draft",
        lastModified: "2023-10-15",
    },
    {
        name: "Smart Watch V2",
        product: "Smart Watch Series 2",
        status: "Active",
        lastModified: "2024-01-05",
    },
    {
        name: "Coffee Maker Social",
        product: "Artisan Coffee Maker",
        status: "Archived",
        lastModified: "2023-03-12",
    },
    {
        name: "Running Shoes - Summer",
        product: "Featherlight Runners",
        status: "Active",
        lastModified: "2024-02-28",
    },
];


export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        title="Templates"
        description="Manage your saved product description templates."
      >
        <Button>New Template</Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>My Templates</CardTitle>
            <CardDescription>A list of your saved description templates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.name}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.product}</TableCell>
                  <TableCell>
                    <Badge variant={template.status === 'Active' ? 'default' : 'secondary'} className={template.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/20' : ''}>{template.status}</Badge>
                  </TableCell>
                  <TableCell>{template.lastModified}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

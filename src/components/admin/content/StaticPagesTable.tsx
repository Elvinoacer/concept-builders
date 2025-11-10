
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiFile } from "react-icons/fi";

const StaticPagesTable = ({ pages }) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <FiFile className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{page.name}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaticPagesTable;

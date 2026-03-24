"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomDesignRequest } from "@/generated/prisma/browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomDesignRequests = () => {
  const [requests, setRequests] = useState<CustomDesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/custom-design-requests");
        if (!res.ok) {
          throw new Error("Failed to fetch custom design requests");
        }
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching custom design requests:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Loading state with responsive design
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-muted-foreground">
            Loading requests...
          </p>
        </div>
      </div>
    );
  }

  // Error state with responsive design
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-destructive text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">
            Unable to load requests
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto max-w-[95vw] lg:max-w-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          Custom Design Requests
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({requests.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium px-4 py-3">
                  Name
                </TableHead>
                <TableHead className="text-sm font-medium px-4 py-3">
                  Email
                </TableHead>
                <TableHead className="text-sm font-medium px-4 py-3">
                  Design Type
                </TableHead>
                <TableHead className="text-sm font-medium px-4 py-3">
                  Budget
                </TableHead>
                <TableHead className="text-sm font-medium px-4 py-3">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.id}
                  onClick={() =>
                    router.push(`/admin/custom-design-requests/${request.id}`)
                  }
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-sm">
                    {request.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <a
                      href={`mailto:${request.email}`}
                      className="text-primary hover:underline break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {request.email}
                    </a>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {request.designType}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium">
                    {request.budget}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={
                        request.status === "COMPLETED"
                          ? "default"
                          : request.status === "PENDING"
                            ? "secondary"
                            : request.status === "IN_PROGRESS"
                              ? "outline"
                              : "destructive"
                      }
                      className="text-xs"
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3 p-4 sm:p-6">
          {requests.map((request) => (
            <Card
              key={request.id}
              onClick={() =>
                router.push(`/admin/custom-design-requests/${request.id}`)
              }
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-primary"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {request.name}
                    </h3>
                    <a
                      href={`mailto:${request.email}`}
                      className="text-primary text-sm hover:underline break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {request.email}
                    </a>
                  </div>
                  <Badge
                    variant={
                      request.status === "COMPLETED"
                        ? "default"
                        : request.status === "PENDING"
                          ? "secondary"
                          : request.status === "IN_PROGRESS"
                            ? "outline"
                            : "destructive"
                    }
                    className="text-xs shrink-0 ml-2"
                  >
                    {request.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium truncate">{request.designType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">{request.budget}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-muted-foreground">
                    Tap to view details
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              When customers submit custom design requests, they'll appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomDesignRequests;

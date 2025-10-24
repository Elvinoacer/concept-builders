"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CustomDesignRequest, CustomDesignRequestStatus } from "@/generated/prisma";
import { useRouter } from 'next/navigation';

const MyRequests = () => {
  const [requests, setRequests] = useState<CustomDesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/dashboard/my-requests');
        if (!res.ok) {
          throw new Error('Failed to fetch your custom design requests');
        }
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching custom design requests:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading your requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Custom Design Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">You haven't made any custom design requests yet.</p>
            <a href="/custom-design" className="text-blue-600 hover:underline mt-2 inline-block">Make a request</a>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Design Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} onClick={() => router.push(`/custom-design/${request.id}`)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{request.designType}</TableCell>
                  <TableCell>{request.budget}</TableCell>
                  <TableCell><Badge>{request.status}</Badge></TableCell>
                </TableRow>
            ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MyRequests;

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
    <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">My Custom Design Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">edit_document</span>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">You haven't made any custom design requests yet.</p>
            <a href="/custom-design" className="text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:shadow-lg transition-shadow mt-6 inline-block px-8 py-3 rounded-full font-bold text-lg">Make a request</a>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-md font-bold">Date</TableHead>
                <TableHead className="text-md font-bold">Design Type</TableHead>
                <TableHead className="text-md font-bold">Budget</TableHead>
                <TableHead className="text-md font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} onClick={() => router.push(`/custom-design/${request.id}`)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                  <TableCell className="py-4 text-lg">{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 text-lg">{request.designType}</TableCell>
                  <TableCell className="py-4 text-lg">{request.budget}</TableCell>
                  <TableCell className="py-4"><Badge className="text-lg px-4 py-1">{request.status}</Badge></TableCell>
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

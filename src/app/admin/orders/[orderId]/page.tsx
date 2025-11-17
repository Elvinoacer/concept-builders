"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FiArrowLeft, FiPackage, FiDollarSign, FiCalendar, FiUser, FiHash, FiCreditCard, FiTag, FiFileText } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import FileUpload from "@/components/admin/designs/FileUpload"; // Reusing FileUpload component
import { FileType } from "@/generated/prisma";

const AdminOrderDetailPage = () => {
  const params = useParams();
  const { orderId } = params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      setError(err.message);
      toast.error("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadSuccess = async (itemId: string, fileTypeCategory: FileType) => {
    // Re-fetch order details to update the delivered files list
    toast.success("File uploaded successfully. Updating order details...");
    await fetchOrderDetails();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <CgSpinner className="animate-spin text-blue-500 text-4xl" />
        <p className="ml-3 text-gray-600 dark:text-gray-400">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-gray-600 dark:text-gray-400">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Details #{order.id}</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          <FiArrowLeft className="mr-2" /> Back to Orders
        </Button>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FiPackage className="text-blue-500" /> Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2"><FiHash className="text-gray-500" /> <strong>Order ID:</strong> {order.id}</p>
          <p className="flex items-center gap-2"><FiUser className="text-gray-500" /> <strong>Customer:</strong> {order.user?.name || "N/A"} ({order.user?.email || "N/A"})</p>
          <p className="flex items-center gap-2"><FiCalendar className="text-gray-500" /> <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="flex items-center gap-2"><FiDollarSign className="text-gray-500" /> <strong>Total Amount:</strong> ${order.amount.toFixed(2)}</p>
          <p className="flex items-center gap-2"><FiCreditCard className="text-gray-500" /> <strong>Payment Gateway:</strong> {order.paymentGateway}</p>
          <p className="flex items-center gap-2"><FiHash className="text-gray-500" /> <strong>Payment ID:</strong> {order.paymentId}</p>
          <p className="flex items-center gap-2"><FiTag className="text-gray-500" /> <strong>Discount:</strong> {order.discountCode || "None"} ({order.discountAmount ? `$${order.discountAmount.toFixed(2)}` : "N/A"})</p>
          <p className="flex items-center gap-2"><FiPackage className="text-gray-500" /> <strong>Status:</strong> {order.status}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FiFileText className="text-green-500" /> Purchased Items & Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.map((item: any) => (
            <div key={item.id} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{item.design?.name || "Design Name N/A"} (Qty: {item.quantity})</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Item ID: {item.id}</p>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Selected File Types:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                  {item.selectedFileTypes.length > 0 ? (
                    item.selectedFileTypes.map((fileType: string) => (
                      <li key={fileType}>{fileType}</li>
                    ))
                  ) : (
                    <li>No specific file types selected.</li>
                  )}
                </ul>

                {item.selectedExtras && Object.keys(item.selectedExtras).length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-4">Selected Extras:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {Object.entries(item.selectedExtras).map(([key, value]: [string, any]) => (
                        <li key={key}><strong>{key}:</strong> {JSON.stringify(value)}</li>
                      ))}
                    </ul>
                  </>
                )}

                <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-4">Delivered Files:</h4>
                {item.deliveredFiles && item.deliveredFiles.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {item.deliveredFiles.map((deliveredFile: any) => (
                      <li key={deliveredFile.id} className="flex items-center justify-between">
                        <span>{deliveredFile.file?.name || "Unknown File"} ({deliveredFile.file?.type})</span>
                        <a href={deliveredFile.file?.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No files delivered yet for this item.</p>
                )}

                <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-4">Upload Missing Files:</h4>
                <div className="space-y-2">
                  {/* Example: Structural PDF */}
                  {item.selectedFileTypes.includes("STRUCTURAL_PDF") && !item.deliveredFiles.some((df: any) => df.file?.type === "PDF" && df.file?.name.includes("Structural")) && (
                    <div className="border p-3 rounded-md bg-white dark:bg-gray-700">
                      <p className="text-sm font-medium mb-2">Upload Structural PDF:</p>
                      <FileUpload
                        onUploadSuccess={(files: any[]) => handleFileUploadSuccess(item.id, FileType.PDF)}
                        onFileRemove={() => {}} // No remove functionality here for now
                        initialFiles={[]}
                        fileTypeCategory={FileType.PDF}
                        multiple={false}
                        accept="application/pdf"
                        uploadUrl={`/api/admin/orders/${order.id}/items/${item.id}/files`}
                      />
                    </div>
                  )}

                  {/* Example: Structural CAD */}
                  {item.selectedFileTypes.includes("STRUCTURAL_CAD") && !item.deliveredFiles.some((df: any) => df.file?.type === "CAD" && df.file?.name.includes("Structural")) && (
                    <div className="border p-3 rounded-md bg-white dark:bg-gray-700">
                      <p className="text-sm font-medium mb-2">Upload Structural CAD:</p>
                      <FileUpload
                        onUploadSuccess={(files: any[]) => handleFileUploadSuccess(item.id, FileType.CAD)}
                        onFileRemove={() => {}}
                        initialFiles={[]}
                        fileTypeCategory={FileType.CAD}
                        multiple={false}
                        accept=".dwg, .dxf"
                        uploadUrl={`/api/admin/orders/${order.id}/items/${item.id}/files`}
                      />
                    </div>
                  )}

                  {/* Add more conditional upload sections for other file types as needed */}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetailPage;

import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminInquiryDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminInquiryDetailPage({
  params,
}: AdminInquiryDetailPageProps) {
  const { id } = params;

  const inquiry = await prisma.designInquiry.findUnique({
    where: { id },
    include: {
      design: true,
    },
  });

  if (!inquiry) {
    notFound();
  }

  // Mark as read if not already
  if (!inquiry.read) {
    await prisma.designInquiry.update({
      where: { id },
      data: { read: true },
    });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inquiries
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inquiry Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Received on {format(new Date(inquiry.createdAt), "PPP 'at' p")}
          </p>
        </div>
        <div className="flex gap-3">
          <a href={`mailto:${inquiry.email}`}>
            <Button>
              <Mail className="w-4 h-4 mr-2" />
              Reply via Email
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>
                {inquiry.inquiryType === "NEGOTIATION"
                  ? "Price Negotiation Request"
                  : "General Inquiry"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {inquiry.message}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </label>
                <p className="text-base font-medium">{inquiry.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-blue-600 hover:underline truncate"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {inquiry.phone || "N/A"}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Design Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Design Name
                </label>
                <p className="text-base font-medium">{inquiry.design.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Base Price
                </label>
                <p className="text-base font-medium">
                  $
                  {inquiry.design.basePrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <Link href={`/designs/${inquiry.design.id}`} target="_blank">
                <Button variant="outline" className="w-full mt-2">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Design
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

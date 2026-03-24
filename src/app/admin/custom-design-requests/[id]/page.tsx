import { notFound } from "next/navigation";
import CustomDesignRequestDetails from "@/components/custom-design/CustomDesignRequestDetails";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma/browser";

interface AdminCustomDesignRequestPageProps {
  params: Promise<{ id: string }>;
}

const AdminCustomDesignRequestPage = async ({
  params,
}: AdminCustomDesignRequestPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== Role.ADMIN) {
    notFound(); // Or redirect to unauthorized page
  }

  const { id } = await params;

  const request = await prisma.customDesignRequest.findUnique({
    where: { id },
  });

  if (!request) {
    notFound();
  }

  return <CustomDesignRequestDetails initialRequest={request} isAdmin={true} />;
};

export default AdminCustomDesignRequestPage;

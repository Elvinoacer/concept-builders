import { notFound } from "next/navigation";
import CustomDesignRequestDetails from "@/components/custom-design/CustomDesignRequestDetails";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma";

interface AdminCustomDesignRequestPageProps {
  params: { id: string };
}

const AdminCustomDesignRequestPage = async ({
  params,
}: AdminCustomDesignRequestPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== Role.ADMIN) {
    notFound(); // Or redirect to unauthorized page
  }

  const request = await prisma.customDesignRequest.findUnique({
    where: { id: params.id },
  });

  if (!request) {
    notFound();
  }

  return <CustomDesignRequestDetails initialRequest={request} isAdmin={true} />;
};

export default AdminCustomDesignRequestPage;

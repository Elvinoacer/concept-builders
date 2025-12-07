import { notFound } from "next/navigation";
import CustomDesignRequestDetails from "@/components/custom-design/CustomDesignRequestDetails";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CustomDesignRequestPageProps {
  params: Promise<{ id: string }>;
}

const CustomDesignRequestPage = async ({ params }: CustomDesignRequestPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    notFound(); // Or redirect to login
  }

  const { id } = await params;

  const request = await prisma.customDesignRequest.findUnique({
    where: { id },
  });

  if (!request || request.email !== session.user.email) {
    notFound();
  }

  return <CustomDesignRequestDetails initialRequest={request} isAdmin={false} />;
};

export default CustomDesignRequestPage;

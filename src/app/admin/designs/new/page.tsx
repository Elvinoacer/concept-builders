'use client';

import { DesignForm } from "@/components/admin/designs/DesignForm";
import { useSearchParams } from "next/navigation";

const NewDesignPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create New Design</h1>
      <DesignForm initialCategoryId={categoryId} />
    </div>
  );
};

export default NewDesignPage;

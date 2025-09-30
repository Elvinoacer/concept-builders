import { DesignForm } from "@/components/admin/designs/DesignForm";

const NewDesignPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create New Design</h1>
      <DesignForm />
    </div>
  );
};

export default NewDesignPage;

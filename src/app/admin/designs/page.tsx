"use client";

import { useState } from "react";
import DesignsHeader from "@/components/admin/designs/DesignsHeader";
import DesignsTable from "@/components/admin/designs/DesignsTable";
import DesignsTabs from "@/components/admin/designs/DesignsTabs";
import FoldersPage from "@/components/admin/designs/FoldersPage";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";

const DesignsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setFormOpen] = useState(false);

  return (
    <div className="flex-1 p-4 md:p-8">
      <DesignsHeader activeTab={activeTab} onNewDesignClick={() => setFormOpen(true)} />
      <DesignsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "all" ? <DesignsTable /> : <FoldersPage />}
      {isFormOpen && <NewDesignForm onClose={() => setFormOpen(false)} />}
    </div>
  );
};

export default DesignsPage;
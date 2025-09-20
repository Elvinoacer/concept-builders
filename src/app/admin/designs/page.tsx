
"use client";

import { useState } from "react";
import DesignsHeader from "@/components/admin/designs/DesignsHeader";
import DesignsTable from "@/components/admin/designs/DesignsTable";
import DesignsTabs from "@/components/admin/designs/DesignsTabs";
import FoldersPage from "@/components/admin/designs/FoldersPage";

const DesignsPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex-1 p-4 md:p-8">
      <DesignsHeader activeTab={activeTab} />
      <DesignsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "all" ? <DesignsTable /> : <FoldersPage />}
    </div>
  );
};

export default DesignsPage;

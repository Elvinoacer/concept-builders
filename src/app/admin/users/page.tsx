"use client";

import { useState } from "react";
import TeamTable from "@/components/admin/users/TeamTable";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersTabs from "@/components/admin/users/UsersTabs";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="flex-1 p-4 md:p-8 dark:bg-gray-900">
      <UsersHeader />
      <UsersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "team" ? <TeamTable /> : <div>Clients Table</div>}
    </div>
  );
};

export default UsersPage;

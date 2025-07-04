import React, { useState } from "react";
import { Layout } from "@Components/ExportComponent";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { RolesTab } from "./RolesTab";
import { PermissionsTab } from "./PermissionsTab";
import { AssignPermissionsTab } from "./AssignPermissionsTab";
import { AssignRolesTab } from "./AssignRolesTab";
import { Toaster } from "react-hot-toast";
import { TabKey } from "@Types/roleTypes";

export default function ManageRolePage() {
  const getInitialTab = (): TabKey => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeTab") as TabKey | null;
      if (saved === "roles" || saved === "permissions" || saved === "assignPermissions" || saved === "assignRoles") {
        return saved;
      }
    }
    return "roles";
  };

  const [activeTab, setActiveTabState] = useState<TabKey>(getInitialTab);

  const setActiveTab = (tab: TabKey) => {
    setActiveTabState(tab);
    localStorage.setItem("activeTab", tab);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "roles", label: "Roles Management" },
    { key: "permissions", label: "Permissions Management" },
    { key: "assignPermissions", label: "Assign Permissions to Role" },
    { key: "assignRoles", label: "Assign Roles to User" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Layout>
        <div className="flex items-center mb-6 mt-2">
          <ShieldCheckIcon className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 ml-2">Role & Permission Management</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 mb-4">
          <nav className="-mb-px flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-4 transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-neutral-800 dark:border-neutral-100 font-semibold text-neutral-800 dark:text-neutral-100"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === "roles" && <RolesTab />}
        {activeTab === "permissions" && <PermissionsTab />}
        {activeTab === "assignPermissions" && <AssignPermissionsTab />}
        {activeTab === "assignRoles" && <AssignRolesTab />}
      </Layout>
    </>
  );
}

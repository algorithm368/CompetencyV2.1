import React, { useState, useEffect } from "react";
import RolePage from "./Role/RolePage";
import { RolePermissionManager } from "./RolePermission/RolePermissionManager";
import UserRoleAssignmentPage from "./UserRole/UserRoleAssignment";
import PermissionPage from "./Permission/PermissionPage";
import OperationPage from "./Operation/OperationPage";
import AssetPage from "./Asset/AssetPage";
import AssetInstancePage from "./AssetInstance/AssetInstancePage";
import UserAssetInstanceAssignmentPage from "./UserAssetInstanceAssignment/UserAssetInstanceAssignmentPage";

import { AdminLayout } from "@Layouts/AdminLayout";

type TabKey = "roles" | "rolePermissions" | "permissions" | "operations" | "assets" | "assetInstances" | "userRoles" | "userAssetInstances";

const tabs: { key: TabKey; label: string; component: React.ReactNode }[] = [
  { key: "roles", label: "Roles", component: <RolePage /> },
  { key: "rolePermissions", label: "Role Permissions", component: <RolePermissionManager /> },
  { key: "permissions", label: "Permissions", component: <PermissionPage /> },
  { key: "operations", label: "Operations", component: <OperationPage /> },
  { key: "assets", label: "Assets", component: <AssetPage /> },
  { key: "assetInstances", label: "Asset Instances", component: <AssetInstancePage /> },
  { key: "userRoles", label: "User Roles", component: <UserRoleAssignmentPage /> },
  { key: "userAssetInstances", label: "User Asset Instances", component: <UserAssetInstanceAssignmentPage /> },
];

const STORAGE_KEY = "adminRbacActiveTab";

const AdminRbacPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    return (localStorage.getItem(STORAGE_KEY) as TabKey) || "roles";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeTab);
  }, [activeTab]);

  const activeTabComponent = React.useMemo(() => {
    return tabs.find((tab) => tab.key === activeTab)?.component || null;
  }, [activeTab]);

  return (
    <AdminLayout>
      <div className="mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">RBAC Administration</h1>

        {/* Tab Headers */}
        <div className="flex border-b mb-6 space-x-6 overflow-x-auto">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              className={`pb-2 border-b-4 font-semibold whitespace-nowrap transition-colors ${
                activeTab === key ? "border-blue-600 text-blue-600" : "border-transparent hover:text-blue-500 hover:border-blue-500"
              }`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div role="tabpanel">{activeTabComponent}</div>
      </div>
    </AdminLayout>
  );
};

export default AdminRbacPage;

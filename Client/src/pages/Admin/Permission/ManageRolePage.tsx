import React, { useState } from "react";
import AssignPermissionsTab from "./AssignPermissionsTab";
import AssignRolesTab from "./AssignRolesTab";
import PermissionsTab from "./PermissionsTab";
import RolesTab from "./RolesTab";
import { AdminLayout } from "@Layouts/AdminLayout";

const tabs = [
  { key: "assignPermissions", label: "Assign Permissions", Component: AssignPermissionsTab },
  { key: "assignRoles", label: "Assign Roles", Component: AssignRolesTab },
  { key: "permissions", label: "Permissions", Component: PermissionsTab },
  { key: "roles", label: "Roles", Component: RolesTab },
];

const ManageRolePage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const ActiveComponent = tabs.find((t) => t.key === activeTab)?.Component;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex space-x-4 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-4 font-semibold border-b-2 ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-600"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>{ActiveComponent && <ActiveComponent />}</div>
      </div>
    </AdminLayout>
  );
};

export default ManageRolePage;

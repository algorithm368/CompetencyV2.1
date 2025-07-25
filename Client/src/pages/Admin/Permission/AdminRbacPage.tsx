import React, { useState } from "react";
import RolePage from "./Role/RolePage";
import { RolePermissionManager } from "./RolePermission/RolePermissionManager";
// import UserRoleAssignmentPage from "./UserRole/UserRoleAssignment";
import { AssetPermissionPage } from "./AssetPermission/AssetPermissionPage";
import PermissionPage from "./Permission/PermissionPage";
import { AdminLayout } from "@Layouts/AdminLayout";
import AssetPage from "./Asset/AssetPage";
import { Role } from "@Types/competency/rbacTypes";
const AdminRbacPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roles" | "userRoles" | "assets" | "permissions" | "assetPage">("roles");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <AdminLayout>
      <div className="mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">RBAC Administration</h1>

        {/* Tab Headers */}
        <div className="flex border-b mb-6 space-x-6">
          {" "}
          {/* Added overflow for many tabs */}
          <button className={`pb-2 border-b-4 ${activeTab === "roles" ? "border-blue-600 text-blue-600" : "border-transparent"} font-semibold whitespace-nowrap`} onClick={() => setActiveTab("roles")}>
            Roles & Permissions
          </button>
          <button
            className={`pb-2 border-b-4 ${activeTab === "userRoles" ? "border-blue-600 text-blue-600" : "border-transparent"} font-semibold whitespace-nowrap`}
            onClick={() => setActiveTab("userRoles")}
          >
            User Role Assignment
          </button>
          <button
            className={`pb-2 border-b-4 ${activeTab === "assets" ? "border-blue-600 text-blue-600" : "border-transparent"} font-semibold whitespace-nowrap`}
            onClick={() => setActiveTab("assets")}
          >
            Asset Permissions
          </button>
          <button
            className={`pb-2 border-b-4 ${activeTab === "permissions" ? "border-blue-600 text-blue-600" : "border-transparent"} font-semibold whitespace-nowrap`}
            onClick={() => setActiveTab("permissions")}
          >
            All Permissions
          </button>
          <button
            className={`pb-2 border-b-4 ${activeTab === "assetPage" ? "border-blue-600 text-blue-600" : "border-transparent"} font-semibold whitespace-nowrap`}
            onClick={() => setActiveTab("assetPage")}
          >
            {" "}
            {/* Renamed tab */}
            Asset Management
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "roles" && (
            <>
              <RolePage onSelectRole={setSelectedRole} />
              {selectedRole && <RolePermissionManager role={selectedRole} />}
            </>
          )}
          {/* {activeTab === "userRoles" && <UserRoleAssignmentPage />}
           */}
          {activeTab === "assets" && <AssetPermissionPage />}
          {activeTab === "permissions" && <PermissionPage />}
          {activeTab === "assetPage" && <AssetPage />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRbacPage;

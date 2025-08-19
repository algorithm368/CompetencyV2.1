import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AdminLayout } from "@Layouts/AdminLayout";
import { useDashboardSummary } from "@Hooks/admin/useDashboardSummary";
import { FiUser, FiUsers, FiTrendingUp } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useDashboardSummary();

  if (error) return <p className="text-center py-10 text-red-500">Failed to load dashboard.</p>;

  return (
    <AdminLayout>
      <div className="space-y-6 px-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{isLoading ? <Skeleton width={200} /> : "Dashboard"}</h1>
            <p className="text-gray-500">{isLoading ? <Skeleton width={300} /> : "Welcome to the admin dashboard!"}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6">
                  <Skeleton height={24} width={24} circle />
                  <Skeleton height={20} className="mt-2" />
                  <Skeleton height={30} className="mt-1" />
                </div>
              ))
            : [
                { icon: <FiUsers className="text-3xl text-blue-500" />, label: "Total Users", value: data?.totalUsers },
                { icon: <FiUser className="text-3xl text-green-500" />, label: "Online Users", value: data?.onlineUsers },
                { icon: <FiTrendingUp className="text-3xl text-purple-500" />, label: "Roles Count", value: data?.rolesCount },
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    {card.icon}
                    <p className="text-gray-400 text-sm uppercase tracking-wide">{card.label}</p>
                  </div>
                  {card.label === "Roles Count" ? (
                    <ul className="text-gray-700 text-sm ml-1 space-y-1">
                      {data &&
                        Object.entries(data.rolesCount || {}).map(([role, count]) => (
                          <li key={role}>
                            <span className="font-medium">{role}:</span> {count}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{typeof card.value === "number" || typeof card.value === "string" ? card.value : "-"}</p>
                  )}
                </div>
              ))}
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Users</h2>
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-gray-500 text-sm uppercase tracking-wide">Name</th>
                <th className="p-3 text-gray-500 text-sm uppercase tracking-wide">Email</th>
                <th className="p-3 text-gray-500 text-sm uppercase tracking-wide">Status</th>
                <th className="p-3 text-gray-500 text-sm uppercase tracking-wide">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="p-2">
                        <Skeleton />
                      </td>
                      <td className="p-2">
                        <Skeleton />
                      </td>
                      <td className="p-2">
                        <Skeleton width={80} />
                      </td>
                      <td className="p-2">
                        <Skeleton width={120} />
                      </td>
                    </tr>
                  ))
                : (data?.recentUsers || []).map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">{`${user.firstNameTH || ""} ${user.lastNameTH || ""}`}</td>
                      <td className="p-3 text-gray-700">{user.email}</td>
                      <td className="p-3 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                        {user.status}
                      </td>
                      <td className="p-3 text-gray-700">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top SFIA Skills</h2>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.topSfiaSkills}>
                  <XAxis dataKey="skillName" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averagePercent" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top TPQI Careers</h2>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.topTpqiCareers} layout="vertical" margin={{ left: 50 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="careerName" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="avgSkillPercent" fill="#10B981" name="Skill %" />
                  <Bar dataKey="avgKnowledgePercent" fill="#F59E0B" name="Knowledge %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;

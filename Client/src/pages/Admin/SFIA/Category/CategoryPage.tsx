import React, { useState, useMemo, useRef, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FiEdit, FiTrash2, FiSettings, FiMoreVertical, FiPlus, FiSearch } from "react-icons/fi";
import { DataTable } from "@Components/Common/ExportComponent";
import { AdminLayout } from "@Layouts/AdminLayout";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
};

const makeData = (rows: number): User[] =>
  Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ["Admin", "Editor", "Viewer"][Math.floor(Math.random() * 3)] as User["role"],
  }));

export default function CRUDTableExample() {
  const [data, setData] = useState<User[]>(() => makeData(50));
  const [searchText, setSearchText] = useState("");

  // Handlers
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure to delete this user?")) {
      setData((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleEdit = (row: User) => {
    const name = prompt("Enter new name:", row.name);
    if (name !== null) {
      setData((prev) => prev.map((r) => (r.id === row.id ? { ...r, name } : r)));
    }
  };

  const handleAdd = () => {
    const name = prompt("Enter name for new user:");
    if (name) {
      const email = prompt("Enter email for new user:", "");
      const role = prompt("Enter role (Admin / Editor / Viewer):", "Viewer") as User["role"];
      const maxId = data.reduce((max, u) => (u.id > max ? u.id : max), 0);
      const newUser: User = {
        id: maxId + 1,
        name,
        email: email || "",
        role: ["Admin", "Editor", "Viewer"].includes(role) ? role : "Viewer",
      };
      setData((prev) => [newUser, ...prev]);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter((u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower));
  }, [data, searchText]);

  // Column definitions
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue<number>(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => <span className="text-slate-700">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => <span className="text-slate-700">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => <span className="text-slate-700">{info.getValue<string>()}</span>,
      },
      {
        id: "actions",
        header: () => <FiSettings className="text-lg text-slate-700" />,
        cell: ({ row }) => (
          <RowActions
            onEdit={() => handleEdit(row.original)}
            onDelete={() => handleDelete(row.original.id)}
          />
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Users</h1>
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-3 pr-8 py-1 border border-gray-300 rounded-3xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {/* Add User */}
          <button
            onClick={handleAdd}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            <FiPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable<User>
        data={filteredData}
        columns={columns}
        pageSizes={[5, 10, 20, 50]}
        initialPageSize={10}
      />
    </AdminLayout>
  );
}

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}
const RowActions: React.FC<RowActionsProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      className="relative inline-block"
      ref={ref}
    >
      <button
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FiMoreVertical />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            <FiEdit className="mr-2" /> Edit
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

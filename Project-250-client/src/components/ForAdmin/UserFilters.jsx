import { Search } from "lucide-react";
import Card from "../ui/Card";
;

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}) => {
  const roles = ["all", "student", "admin", "staff"];
  const statuses = ["all", "active", "inactive", "waiting"];

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 text-gray-500 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role === "all"
                ? "All Roles"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 text-gray-500 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "all"
                ? "All Status"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};

export default UserFilters;

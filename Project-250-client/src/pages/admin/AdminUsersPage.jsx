import { useState } from "react";
import Swal from "sweetalert2";
import { mockUsers } from "../../data/mockData";
import PageHeader from "../../components/ForAdmin/PageHeader";
import UserTable from "../../components/ForAdmin/UsersTable";
import SummaryCards from "../../components/ForAdmin/UserSummaryCards";
import UserFilters from "../../components/ForAdmin/UserFilters";

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId &&
        user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "User Deleted",
        text: "The user has been successfully deleted",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "student":
        return "primary";
      case "staff":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "waiting":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <PageHeader onAddUser={() => {}} />
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <UserTable
        users={filteredUsers}
        handleDeleteUser={handleDeleteUser}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
      />
      <SummaryCards users={mockUsers} />
    </div>
  );
};

export default AdminUsersPage;

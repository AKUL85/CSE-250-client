import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../../components/ForAdmin/PageHeader";
import UserTable from "../../components/ForAdmin/UsersTable";
import SummaryCards from "../../components/ForAdmin/UserSummaryCards";
import UserFilters from "../../components/ForAdmin/UserFilters";
import { useNavigate } from "react-router-dom";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
const navigate=useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch users from the server.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🟩 Filtering logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    try {
      const res = await fetch(`http://localhost:4000/users/${user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        // Remove user from local state
        setUsers((prev) => prev.filter((u) => u._id !== user._id));

        await Swal.fire({
          icon: "success",
          title: "User Deleted",
          text: "The user has been successfully deleted",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the user. Try again.",
      });
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
       <PageHeader onAddUser={() => navigate("/admin/register-student")} />
      

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

      {/* Pass real users to summary cards */}
      <SummaryCards users={users} />
    </div>
  );
};

export default AdminUsersPage;

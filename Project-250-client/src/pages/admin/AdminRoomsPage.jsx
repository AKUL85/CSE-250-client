import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageHeader from "../../components/ForAdmin/rooms/PageHeader";
import RoomFilters from "../../components/ForAdmin/rooms/RoomFilters";
import RoomTable from "../../components/ForAdmin/rooms/RoomTable";
import SummaryCards from "../../components/ForAdmin/rooms/SummaryCards";

const AdminRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
 
  // ✅ Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:4000/rooms/all");
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // ✅ Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBlock =
      selectedBlock === "all" || room.block === selectedBlock;
    const matchesStatus =
      selectedStatus === "all" || room.status === selectedStatus;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  // ✅ Handle room deletion
  const handleDeleteRoom = async (room) => {
    const result = await Swal.fire({
      title: "Delete Room",
      text: `Are you sure you want to delete room ${room.number}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:4000/rooms/${room._id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete room");
        setRooms((prev) => prev.filter((r) => r._id !== room._id));
        Swal.fire({
          icon: "success",
          title: "Room Deleted",
          timer: 2000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete room", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "occupied":
        return "warning";
      case "maintenance":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "single":
        return "primary";
      case "double":
        return "secondary";
      case "triple":
        return "accent";
      default:
        return "default";
    }
  };

  // ✅ Handle loading / error states
  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading rooms...</div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      {/* Pass a function to PageHeader to add room to state */}
      <PageHeader
        onAddRoom={(newRoom) => setRooms((prev) => [newRoom, ...prev])}
      />

      <RoomFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <RoomTable
        rooms={filteredRooms}
        handleDeleteRoom={handleDeleteRoom}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
      />

      <SummaryCards rooms={rooms} />
    </div>
  );
};

export default AdminRoomsPage;

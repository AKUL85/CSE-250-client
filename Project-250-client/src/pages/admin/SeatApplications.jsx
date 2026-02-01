import { useEffect, useState } from "react";
import { ChevronDown, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SeatApplications = () => {
  const [applications, setApplications] = useState([]);
  const [vacantSeat, setVacantSeat] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [approvalModal, setApprovalModal] = useState(null);
  const [roomAssignmentModal, setRoomAssignmentModal] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [financialCondition, setFinancialCondition] = useState("average");
  const [sortBy, setSortBy] = useState("none"); // none, cgpa-high, cgpa-low, financial-high, financial-low
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchApplications();
    fetchRooms();
    fetchVacantSeats();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:4000/seat-applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching seat applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:4000/rooms/all");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchVacantSeats = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/rooms/vacant-seat");
      const data = await res.json();
      setVacantSeat(data.totalVacantSeats);
    } catch (error) {
      console.error("Error fetching vacant seats:", error);
    }
  };

  const handleApproveApplication = async (applicationId, approved) => {
    try {
      const res = await fetch(
        `http://localhost:4000/seat-applications/${applicationId}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approved,
            approvalNotes,
            financialCondition,
          }),
        }
      );

      if (res.ok) {
        fetchApplications();
        setApprovalModal(null);
        setApprovalNotes("");
        alert(
          approved
            ? "Application approved successfully!"
            : "Application rejected successfully!"
        );
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application");
    }
  };

  const handleAssignRoom = async (applicationId) => {
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/seat-applications/${applicationId}/assign-room`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: selectedRoom,
            studentInfo: {
              name:
                applications.find((app) => app._id === applicationId)?.name ||
                "N/A",
            },
          }),
        }
      );

      if (res.ok) {
        fetchApplications();
        fetchRooms();
        fetchVacantSeats();
        setRoomAssignmentModal(null);
        setSelectedRoom("");
        alert("Student assigned to room successfully!");
      } else {
        const error = await res.json();
        alert(`Failed: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error assigning room:", error);
      alert("Failed to assign room");
    }
  };

  const getAvailableRooms = () => {
    return rooms.filter((room) => {
      const occupiedSeats = room.occupants ? room.occupants.length : 0;
      return (
        room.status !== "under_maintenance" &&
        occupiedSeats < room.capacity
      );
    });
  };

  const filteredApplications =
    selectedStatus === "all"
      ? applications
      : applications.filter((app) => app.status === selectedStatus);

  const getSortedApplications = () => {
    let sorted = [...filteredApplications];

    if (sortBy === "cgpa-high") {
      sorted.sort((a, b) => parseFloat(b.cgpa || 0) - parseFloat(a.cgpa || 0));
    } else if (sortBy === "cgpa-low") {
      sorted.sort((a, b) => parseFloat(a.cgpa || 0) - parseFloat(b.cgpa || 0));
    } else if (sortBy === "financial-high") {
      const financialOrder = { excellent: 3, average: 2, poor: 1 };
      sorted.sort((a, b) => 
        (financialOrder[b.financialCondition] || 0) - (financialOrder[a.financialCondition] || 0)
      );
    } else if (sortBy === "financial-low") {
      const financialOrder = { excellent: 3, average: 2, poor: 1 };
      sorted.sort((a, b) => 
        (financialOrder[a.financialCondition] || 0) - (financialOrder[b.financialCondition] || 0)
      );
    }

    return sorted;
  };

  const sortedApplications = getSortedApplications();

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Total Vacant Seats</p>
          <p className="text-2xl font-bold text-zinc-800">{vacantSeat}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Total Applications</p>
          <p className="text-2xl font-bold text-zinc-800">{applications.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === "approved").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {applications.filter((a) => a.status === "submitted").length}
          </p>
        </div>
      </div>

      {/* Header & Filters */}
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-semibold text-zinc-800">
          Seat Applications
        </h1>
        <div className="flex gap-2 flex-wrap justify-end">
          {["all", "submitted", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition ${
                selectedStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow border border-zinc-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
          <span className="text-sm font-semibold text-zinc-700">Sort by:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortBy("none")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                sortBy === "none"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSortBy("cgpa-high")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                sortBy === "cgpa-high"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Result (High to Low)
            </button>
            <button
              onClick={() => setSortBy("cgpa-low")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                sortBy === "cgpa-low"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Result (Low to High)
            </button>
            <button
              onClick={() => setSortBy("financial-high")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                sortBy === "financial-high"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Financial Condition (Best First)
            </button>
            <button
              onClick={() => setSortBy("financial-low")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                sortBy === "financial-low"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Financial Condition (Worst First)
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {sortedApplications.length === 0 ? (
        <p className="text-zinc-500 text-center py-8">
          No applications found.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedApplications.map((app) => (
            <div
              key={app._id}
              className="border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition bg-white"
            >
              {/* Application Header */}
              <div
                onClick={() =>
                  setExpandedId(expandedId === app._id ? null : app._id)
                }
                className="p-4 cursor-pointer flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-semibold text-lg capitalize">
                      {app.name || "N/A"}
                    </h2>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        app.status === "submitted"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600">
                    <strong>Room:</strong> {app.roomType} | <strong>Block:</strong>{" "}
                    {app.block} | <strong>CGPA:</strong> {app.cgpa}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-zinc-400 transition ${
                    expandedId === app._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Expanded Details */}
              {expandedId === app._id && (
                <div className="border-t border-zinc-200 p-4 bg-zinc-50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-zinc-500">Department</p>
                      <p className="font-semibold">{app.department.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Semester</p>
                      <p className="font-semibold">{app.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Floor</p>
                      <p className="font-semibold">{app.floor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Email</p>
                      <p className="font-semibold text-blue-600">{app.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Annual Family Income</p>
                      <p className="font-semibold text-green-700">PKR {app.familyIncome ? parseInt(app.familyIncome).toLocaleString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Calculated Financial Status</p>
                      <p className={`font-semibold px-2 py-1 rounded inline-block text-xs ${
                        app.financialCondition === "excellent" ? "bg-green-100 text-green-700" :
                        app.financialCondition === "average" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {app.financialCondition?.toUpperCase() || "N/A"}
                      </p>
                    </div>
                  </div>

                  {app.specialRequests && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-zinc-600">
                        <strong>Special Requests:</strong> {app.specialRequests}
                      </p>
                    </div>
                  )}

                  {app.assignedRoom && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-sm text-zinc-600">
                        <strong>Assigned Room:</strong> {app.assignedRoomDetails.roomNumber} ({app.assignedRoomDetails.roomType}) - Block {app.assignedRoomDetails.block}
                      </p>
                    </div>
                  )}

                  {app.financialCondition && (
                    <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-sm text-zinc-600">
                        <strong>Financial Condition:</strong> {app.financialCondition.toUpperCase()}
                      </p>
                    </div>
                  )}

                  {app.approvalNotes && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-zinc-600">
                        <strong>Notes:</strong> {app.approvalNotes}
                      </p>
                    </div>
                  )}

                  {app.proofFile && (
                    <a
                      href={app.proofFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 text-sm underline mb-4"
                    >
                      📄 View Proof File
                    </a>
                  )}

                  <p className="text-xs text-zinc-400 mb-4">
                    Submitted: {new Date(app.createdAt).toLocaleDateString("en-GB")}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    {app.status === "submitted" && (
                      <>
                        <button
                          onClick={() => {
                            setApprovalModal(app._id);
                            setFinancialCondition("average");
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setApprovalModal(app._id);
                            setFinancialCondition("poor");
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                    {app.status === "approved" && !app.assignedRoom && (
                      <button
                        onClick={() => setRoomAssignmentModal(app._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Assign Room
                      </button>
                    )}
                    {app.status === "approved" && app.assignedRoom && (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Assigned to Room {app.assignedRoomDetails.roomNumber}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {approvalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-zinc-800">
                Application Review
              </h3>
            </div>

            {/* Display Auto-Calculated Financial Condition */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-zinc-600 mb-2">
                <strong>Auto-Calculated Financial Condition:</strong>
              </p>
              <p className={`text-sm font-bold px-3 py-2 rounded inline-block ${
                applications.find(app => app._id === approvalModal)?.financialCondition === "excellent" ? "bg-green-100 text-green-700" :
                applications.find(app => app._id === approvalModal)?.financialCondition === "average" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {applications.find(app => app._id === approvalModal)?.financialCondition?.toUpperCase() || "N/A"}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Based on family income: PKR {applications.find(app => app._id === approvalModal)?.familyIncome ? parseInt(applications.find(app => app._id === approvalModal)?.familyIncome).toLocaleString() : "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Approval Notes
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Enter approval or rejection notes..."
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApproveApplication(approvalModal, true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveApplication(approvalModal, false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setApprovalModal(null);
                  setApprovalNotes("");
                }}
                className="flex-1 px-4 py-2 bg-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Assignment Modal */}
      {roomAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-800 mb-4">
              Assign Room to Student
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Select Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a room...</option>
                {getAvailableRooms().map((room) => {
                  const occupiedSeats = room.occupants ? room.occupants.length : 0;
                  return (
                    <option key={room._id} value={room._id}>
                      Room {room.number} - {room.type} ({occupiedSeats}/{room.capacity}
                      ) - Block {room.block}
                    </option>
                  );
                })}
              </select>
              {getAvailableRooms().length === 0 && (
                <p className="text-red-600 text-sm mt-2">
                  No available rooms with vacant seats
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAssignRoom(roomAssignmentModal)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setRoomAssignmentModal(null);
                  setSelectedRoom("");
                }}
                className="flex-1 px-4 py-2 bg-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatApplications;

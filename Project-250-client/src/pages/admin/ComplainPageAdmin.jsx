import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ComplainPageAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/complains");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // For now, if the endpoint doesn't exist, we might get a 404.
      // I will add the endpoint in the next step.
      const res = await fetch(`http://localhost:4000/api/complains/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        Swal.fire("Updated", `Status changed to ${newStatus}`, "success");
        fetchComplaints();
      } else {
        Swal.fire("Error", "Failed to update status", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || complaint.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Student Complaints</h1>
          <p className="text-zinc-600 font-medium">Manage and resolve student issues</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="text-center border-r pr-4 border-zinc-100">
            <p className="text-xs text-zinc-500 font-bold uppercase">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {complaints.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 font-bold uppercase">Total</p>
            <p className="text-xl font-bold text-indigo-600">{complaints.length}</p>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-900 mb-1">
                            {complaint.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-zinc-500">
                              By User ID: <span className="font-medium text-zinc-700">{complaint.userId}</span>
                            </span>
                            <span className="text-zinc-300">•</span>
                            <span className="text-zinc-500">
                              {dayjs(complaint.createdAt).format("MMM D, YYYY")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-zinc-600 line-clamp-2 mb-4">
                        {complaint.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 border-none">
                          {complaint.category}
                        </Badge>
                        <Badge variant="warning" className="bg-orange-100 text-orange-700 border-none uppercase text-[10px]">
                          {complaint.priority || "Medium"} Priority
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-100 p-6 flex flex-row md:flex-col justify-center gap-2">
                      <div 
                        to={`/complaints/${complaint._id}`}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-zinc-700 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-100 transition font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </div>
                      
                      {complaint.status !== 'resolved' && (
                        <>
                          {complaint.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(complaint._id, 'in-progress')}
                              className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                            >
                              Start Working
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(complaint._id, 'resolved')}
                            className="flex-1 md:flex-none bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-zinc-100">
              <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 font-medium">No complaints found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplainPageAdmin;

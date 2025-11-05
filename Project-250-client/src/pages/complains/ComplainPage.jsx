import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ComplaintHeader from "../../components/Complain/ComplaintHeader";
import ComplaintFilters from "../../components/Complain/ComplaintFilters";
import ComplaintEmptyState from "../../components/Complain/ComplaintEmptyState";
import ComplaintCreateModal from "../../components/Complain/ComplaintCreateModal";
import ComplaintCard from "../../components/Complain/ComplaintCard";

const ComplainPage = () => {
  const [complaints, setComplaints] = useState([]); // ✅ from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
 
  // 🔹 Fetch data from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/complains");
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("❌ Error fetching complaints:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // 🔹 Filter logic
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || complaint.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || complaint.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 🔹 UI
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <ComplaintHeader setShowCreateForm={setShowCreateForm} />

      <ComplaintFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Loading / Error */}
      {loading && (
        <p className="text-gray-600 text-center">Loading complaints...</p>
      )}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      {!loading && !error && (
        <>
          {filteredComplaints.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="space-y-4"
            >
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint._id} complaint={complaint} />
              ))}
            </motion.div>
          ) : (
            <ComplaintEmptyState setShowCreateForm={setShowCreateForm} />
          )}
        </>
      )}

      {showCreateForm && (
        <ComplaintCreateModal setShowCreateForm={setShowCreateForm} />
      )}
    </div>
  );
};

export default ComplainPage;

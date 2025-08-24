import { useState } from "react";
import { motion } from "framer-motion";
import { mockComplaints } from "../../data/mockData";
import ComplaintHeader from "../../components/Complain/ComplaintHeader";
import ComplaintFilters from "../../components/Complain/ComplaintFilters";
import ComplaintEmptyState from "../../components/Complain/ComplaintEmptyState";
import ComplaintCreateModal from "../../components/Complain/ComplaintCreateModal";
import ComplaintCard from "../../components/Complain/ComplaintCard";


const ComplainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
        className="space-y-4"
      >
        {filteredComplaints.map(complaint => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </motion.div>
      {filteredComplaints.length === 0 && (
        <ComplaintEmptyState setShowCreateForm={setShowCreateForm} />
      )}
      {showCreateForm && (
        <ComplaintCreateModal setShowCreateForm={setShowCreateForm} />
      )}
    </div>
  );
};

export default ComplainPage;

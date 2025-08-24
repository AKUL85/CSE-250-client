import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import dayjs from "dayjs";

const ComplaintHeader = ({ complaint }) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <div className="flex items-center gap-4">
      <Link
        to="/complaints"
        className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{complaint.title}</h1>
        <p className="text-gray-500">
          Complaint #{complaint.id} • Filed {dayjs(complaint.createdAt).format("MMM D, YYYY")}
        </p>
      </div>
    </div>
  </motion.div>
);

export default ComplaintHeader;

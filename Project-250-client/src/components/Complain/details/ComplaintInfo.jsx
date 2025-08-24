import { motion } from "framer-motion";
import { User, Calendar, Building } from "lucide-react";
import dayjs from "dayjs";
import Card from "../../ui/Card";


const ComplaintInfo = ({ complaint }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="p-6 bg-white shadow-md rounded-xl">
      <h3 className="font-semibold text-gray-800 mb-4">Complaint Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Filed by</p>
            <p className="font-medium text-gray-800">{complaint.userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium text-gray-800">{dayjs(complaint.createdAt).format("MMM D, YYYY h:mm A")}</p>
          </div>
        </div>
        {complaint.assigneeId && (
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Assigned to</p>
              <p className="font-medium text-gray-800">Staff Member</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  </motion.div>
);

export default ComplaintInfo;

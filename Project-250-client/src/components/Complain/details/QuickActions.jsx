import { motion } from "framer-motion";
import { MessageSquare, Paperclip, AlertTriangle } from "lucide-react";
import Card from "../../ui/Card";


const QuickActions = ({ complaint }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="p-6 bg-white shadow-md rounded-xl">
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium text-gray-800">Add Comment</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <Paperclip className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-800">Attach Files</span>
        </button>
        {complaint.status !== "resolved" && (
          <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-800">Update Priority</span>
          </button>
        )}
      </div>
    </Card>
  </motion.div>
);

export default QuickActions;

import { motion } from "framer-motion";
import dayjs from "dayjs";
import Card from "../../ui/Card";


const UpdatesTimeline = ({ complaint, getStatusIcon }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Status Updates</h2>
      <div className="space-y-6">
        {complaint.updates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 items-start"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                update.status === "resolved"
                  ? "bg-green-500 text-white"
                  : update.status === "in_progress"
                  ? "bg-indigo-500 text-white"
                  : "bg-yellow-500 text-white"
              } shadow-md`}
            >
              {getStatusIcon(update.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-800">
                  {update.status.replace("_", " ").charAt(0).toUpperCase() +
                    update.status.replace("_", " ").slice(1)}
                </p>
                <span className="text-sm text-gray-500">
                  {dayjs(update.createdAt).format("MMM D, YYYY h:mm A")}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{update.note}</p>
              <p className="text-xs text-gray-500 mt-1">by {update.createdBy}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
);

export default UpdatesTimeline;

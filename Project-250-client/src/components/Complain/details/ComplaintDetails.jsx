import { motion } from "framer-motion";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";


const ComplaintDetails = ({ complaint, getStatusIcon, getStatusColor, getPriorityColor }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Complaint Details</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={getStatusColor(complaint.status)} className="flex items-center gap-1">
              {getStatusIcon(complaint.status)}
              {complaint.status.replace("_", " ")}
            </Badge>
            <Badge variant={getPriorityColor(complaint.priority)}>
              {complaint.priority} priority
            </Badge>
            <Badge variant="secondary">{complaint.category}</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
        </div>

        {complaint.photos?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Attached Photos</h3>
            <div className="grid grid-cols-2 gap-4">
              {complaint.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img src={photo} alt={`Complaint photo ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-md" />
                  <div className="absolute inset-0 bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button className="text-white font-medium">View Full Size</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  </motion.div>
);

export default ComplaintDetails;

import { motion } from "framer-motion";
import Card from "../../ui/Card";

const RelatedIssues = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="p-6 bg-white shadow-md rounded-xl">
      <h3 className="font-semibold text-gray-800 mb-4">Related Issues</h3>
      <div className="space-y-3">
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <p className="text-sm font-medium text-gray-800">Power Outlet Not Working</p>
          <p className="text-xs text-gray-500">Electrical • Pending</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default RelatedIssues;

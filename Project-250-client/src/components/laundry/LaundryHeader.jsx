import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

const LaundryHeader = ({ setShowQRScanner }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Laundry Service</h1>
      <p className="text-gray-500">Book and manage your washing machine slots</p>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowQRScanner(true)}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
    >
      <QrCode className="w-5 h-5" />
      Scan QR to Start
    </motion.button>
  </motion.div>
);

export default LaundryHeader;

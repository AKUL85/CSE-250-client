import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

const LaundryQRScannerModal = ({ setShowQRScanner }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ scale: 0.8, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-xl"
    >
      <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <div className="space-y-2">
          <QrCode className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-500">QR Scanner UI</p>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Scan QR Code</h3>
      <p className="text-gray-500 mb-6">Point your camera at the QR code on the washing machine to start your laundry cycle.</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowQRScanner(false)}
        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        Close Scanner
      </motion.button>
    </motion.div>
  </motion.div>
);

export default LaundryQRScannerModal;

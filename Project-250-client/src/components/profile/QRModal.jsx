// src/components/QRModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const QRModal = ({ showQR, setShowQR, user }) => {
  if (!showQR) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowQR(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-zinc-200"
        >
          <div className="w-48 h-48 mx-auto bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 border border-zinc-300">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 ${
                    Math.random() > 0.5 ? 'bg-zinc-800' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-zinc-900">
            Digital Student ID
          </h3>
          <p className="text-sm text-zinc-600 mb-4">
            {user?.studentId} - {user?.name}
          </p>
          <button
            onClick={() => setShowQR(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRModal;
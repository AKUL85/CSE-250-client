import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import Card from "../ui/Card";


const LaundryDateSelector = ({ selectedDate, setSelectedDate }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-center gap-4 mb-4">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-gray-800">Select Date</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = dayjs().add(index, "day");
          const dateStr = date.format("YYYY-MM-DD");
          const isSelected = selectedDate === dateStr;

          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] transition-all ${
                isSelected
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-xs font-medium">{date.format("ddd")}</span>
              <span className="text-lg font-bold">{date.format("D")}</span>
              <span className="text-xs">{date.format("MMM")}</span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  </motion.div>
);

export default LaundryDateSelector;

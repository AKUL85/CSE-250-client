import { motion } from "framer-motion";
import dayjs from "dayjs";
import { mockLaundrySlots } from "../../data/mockData";
import Card from "../ui/Card";


const LaundryTimeSlotGrid = ({ selectedDate, handleBookSlot }) => {
  const timeSlots = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
  const machines = ["M001", "M002", "M003", "M004"];

  const getSlotStatus = (time, machine) => {
    const slot = mockLaundrySlots.find(
      s => dayjs(s.startAt).format("HH:mm") === time && s.machineId === machine
    );
    return slot ? (slot.userId ? "booked" : "available") : "available";
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6 bg-white shadow-md rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Available Slots - {dayjs(selectedDate).format("MMM D, YYYY")}
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <Legend color="bg-green-500" label="Available" />
            <Legend color="bg-yellow-500" label="Booked" />
            <Legend color="bg-red-500" label="Unavailable" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* header */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className="p-3 text-center font-medium text-gray-600">Time</div>
              {machines.map((machine) => (
                <div key={machine} className="p-3 text-center font-medium text-gray-800 bg-gray-100 rounded-lg">
                  {machine}
                </div>
              ))}
            </div>

            {/* grid */}
            <div className="space-y-2">
              {timeSlots.map((time) => (
                <motion.div key={time} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-5 gap-2">
                  <div className="p-3 text-center font-medium text-gray-600">{time}</div>
                  {machines.map((machine) => {
                    const status = getSlotStatus(time, machine);
                    return (
                      <motion.button
                        key={`${time}-${machine}`}
                        whileHover={{ scale: status === "available" ? 1.02 : 1 }}
                        whileTap={{ scale: status === "available" ? 0.98 : 1 }}
                        onClick={() => status === "available" && handleBookSlot(time, machine)}
                        disabled={status !== "available"}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          status === "available"
                            ? "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                            : status === "booked"
                            ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
                            : "bg-red-100 text-red-800 cursor-not-allowed"
                        }`}
                      >
                        {status === "available" ? "Book" : status === "booked" ? "Booked" : "N/A"}
                      </motion.button>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 ${color} rounded`}></div>
    <span className="text-gray-500">{label}</span>
  </div>
);

export default LaundryTimeSlotGrid;

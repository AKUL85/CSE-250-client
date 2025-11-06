import { motion } from "framer-motion";
import { WashingMachine as Washing, Clock, CheckCircle } from "lucide-react";
import dayjs from "dayjs";
import { mockLaundrySlots } from "../../data/mockData";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

 
const LaundryCurrentBookings = ({ handleStartMachine }) => {
  const userBookings = mockLaundrySlots.filter(slot => slot.userId === "1");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Bookings</h2>
        <div className="space-y-3">
          {userBookings.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Washing className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Machine {slot.machineId}</p>
                  <p className="text-sm text-gray-500">
                    {dayjs(slot.startAt).format("MMM D, YYYY h:mm A")} - {dayjs(slot.endAt).format("h:mm A")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={slot.status === "booked" ? "warning" : "success"}
                  className="flex items-center gap-1"
                >
                  {slot.status === "booked" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {slot.status}
                </Badge>
                {slot.status === "booked" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStartMachine(slot.machineId)}
                    className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg font-medium hover:bg-indigo-600 transition-all"
                  >
                    Start Now
                  </motion.button>
                )}
              </div>
            </div>
          ))}

          {userBookings.length === 0 && (
            <div className="text-center py-8">
              <Washing className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No bookings found. Book a slot below.</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default LaundryCurrentBookings;

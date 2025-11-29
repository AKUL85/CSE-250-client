import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Card from "../ui/Card";

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 ${color} rounded`}></div>
    <span className="text-gray-500">{label}</span>
  </div>
);

const LaundryTimeSlotGrid = ({
  selectedDate,
  handleBookSlot,
  currentBooking,
}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch slots from API when selectedDate changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/laundry/slots?date=${dayjs(
            selectedDate
          ).format("YYYY-MM-DD")}`
        );
        if (!res.ok) throw new Error("Failed to fetch slots");
        const data = await res.json();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching laundry slots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, currentBooking]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
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
            {/* Header */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className="p-3 text-center font-medium text-gray-600">
                Time
              </div>
              <div className="p-3 text-center font-medium text-gray-800 bg-gray-100 rounded-lg">
                M001
              </div>
              <div className="p-3 text-center font-medium text-gray-800 bg-gray-100 rounded-lg">
                M002
              </div>
              <div className="p-3 text-center font-medium text-gray-800 bg-gray-100 rounded-lg">
                M003
              </div>
              <div className="p-3 text-center font-medium text-gray-800 bg-gray-100 rounded-lg">
                M004
              </div>
            </div>

            {/* slots[] */}
            <div className="space-y-2">
              {Array.from({ length: slots.length / 4 }).map((_, rowIndex) => {
                const rowSlots = slots.slice(rowIndex * 4, rowIndex * 4 + 4);
                const rowTime = dayjs(rowSlots[0].startAt).format("HH:mm");

                return (
                  <motion.div
                    key={rowIndex}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="grid grid-cols-5 gap-2"
                  >
                    {/* Time Column */}
                    <div className="p-3 text-center font-medium text-gray-600">
                      {rowTime}
                    </div>

                    {/* Four machines */}
                    {rowSlots.map((slot) => {
                      const now = dayjs();
                      const slotStart = dayjs(slot.startAt);

                      let status = "available";
                      if (slotStart.isBefore(now, "minute"))
                        status = "unavailable";
                      else if (slot.userId) status = "booked";

                      return (
                        <motion.button
                          key={slot._id}
                          whileHover={{
                            scale: status === "available" ? 1.02 : 1,
                          }}
                          whileTap={{
                            scale: status === "available" ? 0.98 : 1,
                          }}
                          onClick={() =>
                            status === "available" &&
                            handleBookSlot(
                              dayjs(slot.startAt).format("HH:mm"),
                              slot.machineId
                            )
                          }
                          disabled={status !== "available"}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            status === "available"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                              : status === "booked"
                              ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
                              : "bg-gray-200 text-red-800 cursor-not-allowed"
                          }`}
                        >
                          {status === "available"
                            ? "Book"
                            : status === "booked"
                            ? "Booked"
                            : "N/A"}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default LaundryTimeSlotGrid;

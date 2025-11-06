import { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import LaundryHeader from "../components/laundry/LaundryHeader";
import LaundryDateSelector from "../components/laundry/LaundryDateSelector";
import LaundryCurrentBookings from "../components/laundry/LaundryCurrentBookings";
import LaundryTimeSlotGrid from "../components/laundry/LaundryTimeSlotGrid";
import LaundryQRScannerModal from "../components/laundry/LaundryQRScannerModal";

const LaundryPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleBookSlot = async (time, machineId) => {
    const startAt = time;
    const result = await Swal.fire({
      title: "Book Laundry Slot",
      text: `Book ${machineId} at ${time} on ${dayjs(selectedDate).format(
        "MMM D, YYYY"
      )}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Book Slot",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("http://localhost:4000/api/laundry/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: dayjs(selectedDate).format("YYYY-MM-DD"),
            time, // e.g. "10:00 AM"
            machineId, // e.g. "M001"
            userId: "12345", // replace with logged-in user ID (if available)
          }),
        });

        if (!res.ok) throw new Error("Failed to book slot");
        const data = await res.json();

        await Swal.fire({
          icon: "success",
          title: "Slot Booked!",
          text: "Your laundry slot has been successfully booked",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        // 🔄 Optionally re-fetch slots to update the UI
        // fetchSlots(); // only if `fetchSlots` is accessible here
      } catch (error) {
        console.error("Error booking laundry slot:", error);
        Swal.fire("Error", "Failed to book slot. Please try again.", "error");
      }
    }
  };

  const handleStartMachine = async (machine) => {
    const result = await Swal.fire({
      title: "Start Washing Machine",
      text: `Start machine ${machine}? Make sure you've loaded your laundry.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Start Machine",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Machine Started!",
        text: "Your laundry cycle has begun. You'll be notified when it's complete.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <LaundryHeader setShowQRScanner={setShowQRScanner} />
      <LaundryDateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <LaundryCurrentBookings handleStartMachine={handleStartMachine} />
      <LaundryTimeSlotGrid
        selectedDate={selectedDate}
        handleBookSlot={handleBookSlot}
      />
      {showQRScanner && (
        <LaundryQRScannerModal setShowQRScanner={setShowQRScanner} />
      )}
    </div>
  );
};

export default LaundryPage;

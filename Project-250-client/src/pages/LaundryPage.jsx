import { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import LaundryHeader from "../components/laundry/LaundryHeader";
import LaundryDateSelector from "../components/laundry/LaundryDateSelector";
import LaundryCurrentBookings from "../components/laundry/LaundryCurrentBookings";
import LaundryTimeSlotGrid from "../components/laundry/LaundryTimeSlotGrid";
import LaundryQRScannerModal from "../components/laundry/LaundryQRScannerModal";



const LaundryPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleBookSlot = async (time, machine) => {
    const result = await Swal.fire({
      title: "Book Laundry Slot",
      text: `Book ${machine} at ${time} on ${dayjs(selectedDate).format("MMM D, YYYY")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Book Slot",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Slot Booked!",
        text: "Your laundry slot has been successfully booked",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
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
      <LaundryDateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <LaundryCurrentBookings handleStartMachine={handleStartMachine} />
      <LaundryTimeSlotGrid selectedDate={selectedDate} handleBookSlot={handleBookSlot} />
      {showQRScanner && <LaundryQRScannerModal setShowQRScanner={setShowQRScanner} />}
    </div>
  );
};

export default LaundryPage;

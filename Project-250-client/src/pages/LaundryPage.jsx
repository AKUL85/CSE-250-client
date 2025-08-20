import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, WashingMachine as Washing, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { mockLaundrySlots } from '../data/mockData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import dayjs from 'dayjs';

const LaundryPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const machines = ['M001', 'M002', 'M003', 'M004'];

  const getSlotStatus = (time, machine) => {
    const slot = mockLaundrySlots.find(s => 
      dayjs(s.startAt).format('HH:mm') === time && 
      s.machineId === machine
    );
    
    if (slot) {
      return slot.userId ? 'booked' : 'available';
    }
    return 'available';
  };

  const handleBookSlot = async (time, machine) => {
    const result = await Swal.fire({
      title: 'Book Laundry Slot',
      text: `Book ${machine} at ${time} on ${dayjs(selectedDate).format('MMM D, YYYY')}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6C5CE7',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Book Slot',
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: 'Slot Booked!',
        text: 'Your laundry slot has been successfully booked',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleStartMachine = async (machine) => {
    const result = await Swal.fire({
      title: 'Start Washing Machine',
      text: `Start machine ${machine}? Make sure you've loaded your laundry.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00C2A8',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Start Machine',
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: 'Machine Started!',
        text: 'Your laundry cycle has begun. You\'ll be notified when it\'s complete.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Laundry Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Book time slots for washing machines and manage your laundry
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowQRScanner(true)}
          className="flex items-center gap-2 px-6 py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors"
        >
          <QrCode className="w-5 h-5" />
          Scan QR to Start
        </motion.button>
      </motion.div>

      {/* Date Selector */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Date
            </h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = dayjs().add(index, 'day');
              const dateStr = date.format('YYYY-MM-DD');
              const isSelected = selectedDate === dateStr;
              
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] transition-all ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xs font-medium">
                    {date.format('ddd')}
                  </span>
                  <span className="text-lg font-bold">
                    {date.format('D')}
                  </span>
                  <span className="text-xs">
                    {date.format('MMM')}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Current Bookings */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Bookings
          </h2>
          
          <div className="space-y-3">
            {mockLaundrySlots
              .filter(slot => slot.userId === '1')
              .map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                      <Washing className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Machine {slot.machineId}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dayjs(slot.startAt).format('MMM D, YYYY h:mm A')} - 
                        {dayjs(slot.endAt).format('h:mm A')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={slot.status === 'booked' ? 'warning' : 'success'}
                      className="flex items-center gap-1"
                    >
                      {slot.status === 'booked' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {slot.status}
                    </Badge>
                    
                    {slot.status === 'booked' && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStartMachine(slot.machineId)}
                        className="px-4 py-2 bg-secondary-500 text-white text-sm rounded-lg font-medium hover:bg-secondary-600 transition-colors"
                      >
                        Start Now
                      </motion.button>
                    )}
                  </div>
                </div>
              ))}
              
            {mockLaundrySlots.filter(slot => slot.userId === '1').length === 0 && (
              <div className="text-center py-8">
                <Washing className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No bookings found. Book a slot below.
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Time Slot Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Available Slots - {dayjs(selectedDate).format('MMM D, YYYY')}
            </h2>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Unavailable</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="p-3 text-center font-medium text-gray-600 dark:text-gray-400">
                  Time
                </div>
                {machines.map((machine) => (
                  <div
                    key={machine}
                    className="p-3 text-center font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    {machine}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <motion.div
                    key={time}
                    variants={itemVariants}
                    className="grid grid-cols-5 gap-2"
                  >
                    <div className="p-3 text-center font-medium text-gray-600 dark:text-gray-400">
                      {time}
                    </div>
                    {machines.map((machine) => {
                      const status = getSlotStatus(time, machine);
                      
                      return (
                        <motion.button
                          key={`${time}-${machine}`}
                          whileHover={{ scale: status === 'available' ? 1.02 : 1 }}
                          whileTap={{ scale: status === 'available' ? 0.98 : 1 }}
                          onClick={() => status === 'available' && handleBookSlot(time, machine)}
                          disabled={status !== 'available'}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            status === 'available'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer'
                              : status === 'booked'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 cursor-not-allowed'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 cursor-not-allowed'
                          }`}
                        >
                          {status === 'available' ? 'Book' : status === 'booked' ? 'Booked' : 'N/A'}
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

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-card rounded-2xl p-8 w-full max-w-md text-center"
          >
            <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <div className="space-y-2">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  QR Scanner UI
                </p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Scan QR Code
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Point your camera at the QR code on the washing machine to start your laundry cycle.
            </p>
            <button
              onClick={() => setShowQRScanner(false)}
              className="px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Close Scanner
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LaundryPage;
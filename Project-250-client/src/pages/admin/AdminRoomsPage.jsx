import { useState } from 'react';
import Swal from 'sweetalert2';
import { mockRooms } from '../../data/mockData';
import RoomFilters from '../../components/ForAdmin/rooms/RoomFilters';
import RoomTable from '../../components/ForAdmin/rooms/RoomTable';
import SummaryCards from '../../components/ForAdmin/rooms/SummaryCards';
import PageHeader from '../../components/ForAdmin/rooms/PageHeader';


const AdminRoomsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'all' || room.block === selectedBlock;
    const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  const handleDeleteRoom = async (room) => {
    const result = await Swal.fire({
      title: 'Delete Room',
      text: `Are you sure you want to delete room ${room.number}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
    });
    if (result.isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: 'Room Deleted',
        text: 'The room has been successfully deleted',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'warning';
      case 'maintenance': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'single': return 'primary';
      case 'double': return 'secondary';
      case 'triple': return 'accent';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <PageHeader onAddRoom={() => {}} />
      <RoomFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <RoomTable
        rooms={filteredRooms}
        handleDeleteRoom={handleDeleteRoom}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
      />
      <SummaryCards rooms={mockRooms} />
    </div>
  );
};

export default AdminRoomsPage;

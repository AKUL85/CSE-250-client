import { Search } from 'lucide-react';
import Card from '../../ui/Card';



const RoomFilters = ({
  searchTerm,
  setSearchTerm,
  selectedBlock,
  setSelectedBlock,
  selectedStatus,
  setSelectedStatus
}) => {
  const blocks = ['all', 'A', 'B', 'C', 'D'];
  const statuses = ['all', 'available', 'occupied', 'maintenance'];

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Block Filter */}
        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          {blocks.map(block => (
            <option key={block} value={block}>
              {block === 'all' ? 'All Blocks' : `Block ${block}`}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};

export default RoomFilters;

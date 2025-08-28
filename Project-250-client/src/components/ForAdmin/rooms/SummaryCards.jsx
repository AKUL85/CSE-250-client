import Card from "../../ui/Card";


const SummaryCards = ({ rooms }) => {
    
    return(
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{rooms.length}</div>
      <div className="text-sm text-gray-600">Total Rooms</div>
    </Card>
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-green-600">{rooms.filter(r => r.status === 'available').length}</div>
      <div className="text-sm text-gray-600">Available</div>
    </Card>
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-yellow-600">{rooms.filter(r => r.status === 'occupied').length}</div>
      <div className="text-sm text-gray-600">Occupied</div>
    </Card>
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-blue-600">
        {Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100)}%
      </div>
      <div className="text-sm text-gray-600">Occupancy Rate</div>
    </Card>
  </div>
 );
};
export default SummaryCards

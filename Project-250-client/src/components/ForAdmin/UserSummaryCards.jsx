import Card from "../ui/Card";



const SummaryCards = ({ users }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{users.length}</div>
      <div className="text-sm text-gray-600">Total Users</div>
    </Card>
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-blue-600">
        {users.filter((u) => u.role === "student").length}
      </div>
      <div className="text-sm text-gray-600">Students</div>
    </Card>
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-green-600">
        {users.filter((u) => u.status === "active").length}
      </div>
      <div className="text-sm text-gray-600">Active</div>
    </Card>
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-yellow-600">
        {users.filter((u) => u.status === "waiting").length}
      </div>
      <div className="text-sm text-gray-600">Pending</div>
    </Card>
  </div>
);

export default SummaryCards;

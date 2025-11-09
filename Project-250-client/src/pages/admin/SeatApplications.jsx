import { useEffect, useState } from "react";

const SeatApplications = () => {
  const [applications, setApplications] = useState([]);
  const [vacantSeat, setVacantSeat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:4000/seat-applications");
        const data = await res.json();
        setApplications(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching seat applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchVacantSeat = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/rooms/vacant-seat");
        const data = await res.json();
        setVacantSeat(data.totalVacantSeats);
        console.log(data.totalVacantSeats);
      } catch (error) {
        console.error("Error fetching seat applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacantSeat();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Total Vacant Seats</p>
          <p className="text-2xl font-bold text-zinc-800">{vacantSeat}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Total Applications</p>
          <p className="text-2xl font-bold text-zinc-800">
            {/* {totalApplications} */}
            12
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-zinc-500 text-sm">Approved Applications</p>
          <p className="text-2xl font-bold text-zinc-800">
            {/* {approvedApplications} */}
            0
          </p>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-800 mb-6">
        Seat Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-zinc-500">No applications found.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-medium text-lg capitalize">
                  Room Type: {app.roomType}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    app.status === "submitted"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-sm text-zinc-600">
                <strong>Department:</strong> {app.department.toUpperCase()} |{" "}
                <strong>Floor:</strong> {app.floor} | <strong>Block:</strong>{" "}
                {app.block}
              </p>
              <p className="text-sm text-zinc-600">
                <strong>CGPA:</strong> {app.cgpa} | <strong>Semester:</strong>{" "}
                {app.semester}
              </p>

              {app.specialRequests && (
                <p className="text-sm text-zinc-500 mt-2 italic">
                  “{app.specialRequests}”
                </p>
              )}

              <div className="text-xs text-zinc-400 mt-2">
                Submitted on:{" "}
                {new Date(app.createdAt).toLocaleDateString("en-GB")}
              </div>

              {app.proofFile && (
                <a
                  href={app.proofFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 text-sm mt-2 underline"
                >
                  View Proof File
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatApplications;

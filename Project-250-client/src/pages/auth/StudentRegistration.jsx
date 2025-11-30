import { useState } from "react";
import { Navigate } from "react-router-dom";

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    student_id: "",
    department: "",
    emergency_contact: "",
    room_id: null,
    profile_photo: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const departments = [
    "Arch",
    "ChE",
    "CEE",
    "CSE",
    "EEE",
    "FT",
    "IPE",
    "ME",
    "PME",
    "SWE",
    "BMB",
    "GEB",
    "FES",
    "Chem",
    "GE",
    "Math",
    "Ocean",
    "Phy",
    "Stat",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value === "" && e.target.name === "room_id"
          ? null
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {

        setMessage(`${data.message}`);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone_number: "",
          student_id: "",
          department: "",
          emergency_contact: "",
          room: null,
          profile_photo: "",
          role: "student",
        });
        
      } else {
        setMessage(`${data.message || "Registration failed"}`);
      }
      return <Navigate to="/login" replace />;
    } catch (err) {
      setMessage("Server error");
      return <Navigate to="/login" replace />;
    } finally {
      
      setLoading(false);
    }
  };

  // Professional styling
  const inputClass =
    "w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const sectionClass = "mb-6";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Student Registration
          </h2>
        </div>

        <div className="p-8">
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border-l-4 ${
                message.startsWith("")
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-red-50 border-red-400 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="student@university.edu"
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className={labelClass}>Emergency Contact *</label>
                  <input
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Parent/Guardian phone number"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Student ID *</label>
                  <input
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="2025331000"
                  />
                </div>

                <div>
                  <label className={labelClass}>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className={`${inputClass} px-3 py-0`}
                    // className="mt-1 block w-full h-[40px] px-4 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
                  >
                    <option value="" disabled>
                      -- Select Department --
                    </option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Account & Additional Information Section */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Account & Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Password *</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Set secure password"
                  />
                </div>

                <div>
                  <label className={labelClass}>Profile Photo</label>
                  <input
                    type="file"
                    name="profile_photo"
                    accept="image/*"
                    // required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile_photo: e.target.files[0],
                      })
                    }
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-100"
                  />
                </div>

                <div>
                  <label className={labelClass}>room_id Assignment</label>
                  <input
                    name="room_id"
                    value={formData.room_id || ""}
                    disabled
                    className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
                    placeholder="Will be assigned later"
                  />
                </div>

                <div>
                  <label className={labelClass}>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    disabled
                    className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
                  >
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-pointer hover:bg-blue-700"
                }`}
              >
                {loading ? "Registering Student..." : "Register Student"}
              </button>

              <p className="text-sm text-gray-500 mt-3">
                * Required fields must be filled
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;


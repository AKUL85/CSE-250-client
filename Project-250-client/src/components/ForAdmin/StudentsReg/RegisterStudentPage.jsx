import { useState } from "react";

const RegisterStudentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    room: "",
    role: "student",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:4000/register-student", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setFormData({
          name: "",
          email: "",
          password: "",
          room: "",
          role: "student",
          avatar: "",
        });
      } else {
        setMessage(`❌ ${data.message || "Registration failed"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border text-gray-600 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out hover:shadow-md";

  const labelClass = "block text-sm font-semibold mb-2 text-gray-700";

  return (
    // Outer container with background color and shadow
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-10 transform transition duration-500 ease-in-out hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-8 tracking-tight">
          <span role="img" aria-label="student-icon" className="mr-2">
            🧑‍🎓
          </span>
          New Student Registration
        </h2>

        {/* Message Container with Enhanced Colors and Animation */}
        {message && (
          <div
            className={`text-center mb-6 p-3 rounded-xl border-l-4 font-medium transition duration-500 ease-in-out transform hover:scale-105 ${
              message.startsWith("✅")
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Enter student's name"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Enter student's email"
            />
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Set a password"
            />
          </div>

          {/* Room */}
          <div>
            <label className={labelClass}>Room Number</label>
            <input
              name="room"
              value={formData.room}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g., A-201 (Optional)"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className={labelClass}>Avatar URL (optional)</label>
            <input
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Role (default student) */}
          <div>
            <label className={labelClass}>Role</label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-10`} // Added appearance-none and padding to make space for custom arrow
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button with Hover/Disabled Styles */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-lg transition duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register Student"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudentPage;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Upload, Send, FileImage, X, Loader2 } from "lucide-react";

// Color Palette: Deep Blue (Primary), Slate Gray (Text/Background), Cyan/Teal (Accent)

const ComplainForm = () => {
  const [complaint, setComplaint] = useState({
    category: "",
    customCategory: "", // New state for custom category
    title: "",
    description: "",
    photos: [],
    photoFiles: [], // Store actual file objects for later upload (best practice)
  });

  const [loading, setLoading] = useState(false);

  const CATEGORIES = [
    { value: "plumbing", label: "Plumbing Issue" },
    { value: "electricity", label: "Electrical Fault" },
    { value: "cleaning", label: "Cleaning Request" },
    { value: "maintenance", label: "General Maintenance" },
    { value: "other", label: "Other (Specify)" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 photos for a cleaner form
    if (complaint.photoFiles.length + files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Photo Limit Exceeded",
        text: "You can upload a maximum of 5 photos.",
      });
      return;
    }

    const newPhotoFiles = [...complaint.photoFiles, ...files];
    // Create new URLs only for the newly added files
    const newPhotoUrls = files.map((file) => URL.createObjectURL(file));

    setComplaint((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotoUrls], // URLs for display
      photoFiles: newPhotoFiles, // Files for submission
    }));
  };

  const removePhoto = (indexToRemove) => {
    const updatedPhotos = complaint.photos.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedPhotoFiles = complaint.photoFiles.filter(
      (_, index) => index !== indexToRemove
    );

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(complaint.photos[indexToRemove]);

    setComplaint((prev) => ({
      ...prev,
      photos: updatedPhotos,
      photoFiles: updatedPhotoFiles,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const isCustomCategoryEmpty =
    complaint.category === "other" && !complaint.customCategory;

  if (
    !complaint.title ||
    !complaint.description ||
    !complaint.category ||
    isCustomCategoryEmpty
  ) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all required fields, including the category.",
      confirmButtonColor: "#1d4ed8",
    });
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("category", complaint.category);
    formData.append("customCategory", complaint.customCategory);
    formData.append("title", complaint.title);
    formData.append("description", complaint.description);
    formData.append("userId", "12345"); // 🔹 Replace with actual logged-in user ID

    // Append photos
    complaint.photoFiles.forEach((file) => formData.append("photos", file));

    const res = await fetch("http://localhost:4000/api/complain", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Complaint Submitted!",
        text: "Your request has been successfully recorded.",
        confirmButtonColor: "#1d4ed8",
      });
      setComplaint({
        category: "",
        customCategory: "",
        title: "",
        description: "",
        photos: [],
        photoFiles: [],
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: data.message || "Something went wrong.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: error.message,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl border border-gray-100 rounded-3xl p-6 sm:p-10 w-full max-w-3xl"
      >
        <header className="mb-8 border-b pb-4 border-cyan-100">
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <FileImage className="text-blue-600 w-8 h-8" />
            Maintenance Request
          </h2>
          <p className="text-gray-500 mt-1">
            Please provide details about the issue you are experiencing.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={complaint.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out appearance-none"
                required
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Category Input (Conditional) */}
            <AnimatePresence>
              {complaint.category === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specify Custom Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customCategory"
                    value={complaint.customCategory}
                    onChange={handleChange}
                    placeholder="E.g., Pest Control, Landscaping"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out"
                    required={complaint.category === "other"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint Title/Summary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={complaint.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue (e.g., Leaky faucet in kitchen)"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={complaint.description}
              onChange={handleChange}
              placeholder="Provide specific details: location, when it started, and potential causes."
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out resize-none"
              required
            ></textarea>
          </div>

          {/* Upload Photos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Photos (Max 5, Optional)
            </label>
            <label
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 cursor-pointer transition duration-150 ease-in-out 
                ${
                  complaint.photoFiles.length >= 5
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-cyan-400 text-cyan-700 hover:border-cyan-600 hover:bg-cyan-50"
                }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-medium">
                {complaint.photoFiles.length > 0
                  ? `${complaint.photoFiles.length} / 5 Images Added. Click to add more.`
                  : "Click to upload images (PNG, JPG)"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                disabled={complaint.photoFiles.length >= 5}
              />
            </label>

            <AnimatePresence>
              {complaint.photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4"
                >
                  {complaint.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={photo}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing Request...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Complaint Now
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ComplainForm;
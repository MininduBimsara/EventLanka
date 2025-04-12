import React, { useState } from "react";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const MyReviews = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Mock reviews data - in a real app, this would come from your API
  const [reviews, setReviews] = useState([
    {
      id: 1,
      eventName: "Music Festival 2024",
      date: "Dec 15, 2024",
      rating: 5,
      comment:
        "Amazing experience! The artists were incredible and the organization was perfect.",
    },
    {
      id: 2,
      eventName: "Tech Conference",
      date: "Oct 22, 2024",
      rating: 4,
      comment:
        "Great speakers and networking opportunities. The venue could have been better though.",
    },
    {
      id: 3,
      eventName: "Food Festival",
      date: "Sep 5, 2024",
      rating: 3,
      comment:
        "Decent variety of cuisines, but long waiting lines at most stalls.",
    },
  ]);

  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  });

  // Delete a review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((review) => review.id !== reviewId));
    }
  };

  // Start editing a review
  const handleEditStart = (review) => {
    setEditingReview(review.id);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  // Save edited review
  const handleSaveEdit = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, rating: editForm.rating, comment: editForm.comment }
          : review
      )
    );
    setEditingReview(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Render stars for ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={
          i < rating
            ? "text-amber-500"
            : darkMode
            ? "text-gray-600"
            : "text-gray-300"
        }
        size={20}
      />
    ));
  };

  // Render edit form stars
  const renderEditStars = () => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setEditForm({ ...editForm, rating: i + 1 })}
        className="transition-transform focus:outline-none hover:scale-110"
      >
        <FaStar
          className={
            i < editForm.rating
              ? "text-amber-500"
              : darkMode
              ? "text-gray-600"
              : "text-gray-300"
          }
          size={24}
        />
      </button>
    ));
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } transition-colors duration-200`}
    >
      <div className="container px-4 pt-16 pb-16 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`pb-4 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h1 className="mb-2 text-3xl font-bold">My Reviews</h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Manage your event ratings and feedback
            </p>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-white text-gray-800"
            } shadow-md hover:shadow-lg transition-all`}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        {reviews.length === 0 ? (
          <div
            className={`p-8 text-center rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FaStar
              className={`mx-auto mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-300"
              }`}
              size={48}
            />
            <h3 className="mb-2 text-xl font-medium">No Reviews Yet</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              You haven't reviewed any events yet. After attending an event, you
              can share your experience here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`p-6 rounded-lg shadow-md transition-transform hover:shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {editingReview === review.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">
                        {review.eventName}
                      </h3>
                      <div
                        className={`flex items-center text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaCalendarAlt className="mr-1" />
                        {review.date}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Your Rating
                      </label>
                      <div className="flex space-x-1 text-2xl">
                        {renderEditStars()}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Your Review
                      </label>
                      <textarea
                        name="comment"
                        value={editForm.comment}
                        onChange={handleEditChange}
                        className={`w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSaveEdit(review.id)}
                        className="px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
                          darkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-3">
                      <h3 className="text-xl font-semibold">
                        {review.eventName}
                      </h3>
                      <div
                        className={`flex items-center text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaCalendarAlt className="mr-1" />
                        {review.date}
                      </div>
                    </div>

                    <div className="flex mb-4 space-x-1">
                      {renderStars(review.rating)}
                    </div>

                    <p
                      className={`mb-4 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {review.comment}
                    </p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditStart(review)}
                        className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition-colors"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition-colors"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;

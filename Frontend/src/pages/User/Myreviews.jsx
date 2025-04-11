import React, { useState } from "react";
import { FaStar, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";

const MyReviews = () => {
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

  // Render stars for ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-600"}
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
        className="focus:outline-none"
      >
        <FaStar
          className={i < editForm.rating ? "text-yellow-400" : "text-gray-600"}
        />
      </button>
    ));
  };

  return (
    <div className="container px-4 pt-24 pb-16 mx-auto">
      <div className="pb-8 mb-8 border-b border-gray-700">
        <h1 className="mb-2 text-3xl font-bold">My Reviews</h1>
        <p className="text-gray-500">Manage your event ratings and feedback</p>
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 text-center bg-gray-800 rounded-lg shadow">
          <FaStar className="mx-auto mb-4 text-gray-500" size={48} />
          <h3 className="mb-2 text-xl font-medium">No Reviews Yet</h3>
          <p className="text-gray-500">
            You haven't reviewed any events yet. After attending an event, you
            can share your experience here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 bg-gray-800 rounded-lg shadow">
              {editingReview === review.id ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">
                      {review.eventName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
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
                      className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSaveEdit(review.id)}
                      className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      {review.date}
                    </div>
                  </div>

                  <div className="flex mb-4 space-x-1 text-lg">
                    {renderStars(review.rating)}
                  </div>

                  <p className="mb-4 text-gray-300">{review.comment}</p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditStart(review)}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="flex items-center px-3 py-1.5 text-sm bg-red-600 rounded hover:bg-red-700 focus:outline-none"
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
  );
};

export default MyReviews;

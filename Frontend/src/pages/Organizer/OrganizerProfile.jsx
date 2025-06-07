import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  Save,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import {
  fetchOrganizerProfile,
  updateOrganizerProfile,
} from "../../Redux/Thunks/organizerThunk";
import {
  validateOrganizerProfile,
  validateNewCategory,
  validateProfileImage,
  validateFieldRealTime,
} from "../../Utils/Organizer/profileValidation";
import { useToast } from "../../components/Common/Notification/ToastContext";

export default function OrganizerProfile() {
  const toast = useToast();
  const dispatch = useDispatch();
  const { organizerProfile, loading, error } = useSelector(
    (state) => state.organizer
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Add image preview state
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    website: "",
    social: {
      instagram: "",
      facebook: "",
      linkedin: "",
    },
    categories: [],
    isPublic: true,
  });

  // Fetch profile data when component mounts - ONLY ONCE
  useEffect(() => {
    dispatch(fetchOrganizerProfile());
  }, [dispatch]); // Only dispatch as dependency

  // Update local state when profile data is received from Redux
  useEffect(() => {
    // console.log("Profile data useEffect triggered");
    if (organizerProfile) {
      // console.log("Profile data received:", organizerProfile);
      // console.log("Profile image field:", organizerProfile.profileImage);

      setProfile({
        name: organizerProfile.username || "",
        email: organizerProfile.email || "",
        phone: organizerProfile.phone || "",
        bio: organizerProfile.bio || "",
        website: organizerProfile.website || "",
        social: {
          instagram: organizerProfile.instagram || "",
          facebook: organizerProfile.facebook || "",
          linkedin: organizerProfile.linkedin || "",
        },
        categories: organizerProfile.categories || [],
        isPublic:
          organizerProfile.isPublic !== undefined
            ? organizerProfile.isPublic
            : true,
      });
    }
  }, [organizerProfile]); // Only organizerProfile as dependency

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Real-time validation
    const error = validateFieldRealTime(
      name.includes(".") ? name.split(".")[1] : name,
      value
    );
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value,
        },
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleTogglePublic = () => {
    setProfile({
      ...profile,
      isPublic: !profile.isPublic,
    });
  };

  const handleAddCategory = () => {
    const validation = validateNewCategory(newCategory, profile.categories);

    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        newCategory: validation.errors.category,
      }));
      return;
    }

    setProfile({
      ...profile,
      categories: [...profile.categories, validation.sanitizedCategory],
    });
    setNewCategory("");
    setValidationErrors((prev) => ({
      ...prev,
      newCategory: null,
    }));
  };

  const handleRemoveCategory = (category) => {
    setProfile({
      ...profile,
      categories: profile.categories.filter((cat) => cat !== category),
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateProfileImage(file);

      if (!validation.isValid) {
        setValidationErrors((prev) => ({
          ...prev,
          profileImage: validation.errors.file,
        }));
        setImagePreview(null);
        return;
      }

      setProfileImage(file);
      setValidationErrors((prev) => ({
        ...prev,
        profileImage: null,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);

    // Validate the entire profile
    const validation = validateOrganizerProfile(profile);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Clear validation errors
    setValidationErrors({});
    setFieldErrors({});

    // Create FormData for file upload
    const formData = new FormData();

    // Map the sanitized profile data to what the backend expects
    formData.append("username", validation.sanitizedProfile.name);
    formData.append("phone", validation.sanitizedProfile.phone);
    formData.append("bio", validation.sanitizedProfile.bio);
    formData.append("website", validation.sanitizedProfile.website);
    formData.append("instagram", validation.sanitizedProfile.social.instagram);
    formData.append("facebook", validation.sanitizedProfile.social.facebook);
    formData.append("linkedin", validation.sanitizedProfile.social.linkedin);
    formData.append(
      "categories",
      JSON.stringify(validation.sanitizedProfile.categories)
    );
    formData.append("isPublic", validation.sanitizedProfile.isPublic);

    // Add profile image if one was selected
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // Dispatch the update action
    try {
      await dispatch(updateOrganizerProfile(formData)).unwrap();

      // Show success message
      toast.success("Profile updated successfully!");

      setIsEditing(false);
      setProfileImage(null);
      setImagePreview(null);

      // Don't manually refetch - Redux state should already be updated by the thunk
      // dispatch(fetchOrganizerProfile()); // REMOVE THIS LINE - it causes infinite loop
    } catch (error) {
      // console.error("Failed to update profile:", error);
      toast.error(error || "Failed to update profile. Please try again.");
      setValidationErrors({
        submit: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle size={14} className="mr-1" />
        {error}
      </div>
    );
  };

  // Function to get the correct image URL
  const getImageUrl = () => {
    // console.log("Getting image URL...");
    // console.log("imagePreview:", imagePreview);
    // console.log(
    //   "organizerProfile?.profileImage:",
    //   organizerProfile?.profileImage
    // );

    if (imagePreview) {
      // console.log("Using image preview");
      return imagePreview; // Show preview of newly selected image
    }

    if (organizerProfile?.profileImage) {
      let imageUrl;

      // If the profileImage is just a filename, construct the full URL
      if (organizerProfile.profileImage.startsWith("http")) {
        imageUrl = organizerProfile.profileImage;
      } else {
        // Remove leading slash if present
        const imagePath = organizerProfile.profileImage.startsWith("/")
          ? organizerProfile.profileImage.substring(1)
          : organizerProfile.profileImage;

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        imageUrl = `${baseUrl}/${imagePath}`;
      }

      // console.log("Constructed image URL:", imageUrl);
      return imageUrl;
    }

    // console.log("Using fallback placeholder");
    return "/api/placeholder/200/200"; // Fallback placeholder
  };

  if (loading && !organizerProfile) {
    return <div className="flex justify-center p-10">Loading profile...</div>;
  }

  if (error && !organizerProfile) {
    return (
      <div className="p-10 text-red-500">Error loading profile: {error}</div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Organizer Profile
      </h1>

      {validationErrors.submit && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-300 rounded-md">
          {validationErrors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Picture */}
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-200 rounded-full">
                <img
                  src={getImageUrl()}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // console.error("Image failed to load:", e.target.src);
                    e.target.src = "/api/placeholder/200/200";
                  }}
                  onLoad={() => {
                    // console.log("Image loaded successfully:", getImageUrl());
                  }}
                />
              </div>
              {isEditing && (
                <label
                  htmlFor="profile-image-input"
                  className="absolute p-2 text-white bg-blue-600 rounded-full cursor-pointer bottom-2 right-2 hover:bg-blue-700"
                >
                  <Camera size={20} />
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <ErrorMessage error={validationErrors.profileImage} />

            <div className="w-full mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Public Profile
                </h3>
                <button
                  onClick={handleTogglePublic}
                  disabled={!isEditing}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    profile.isPublic
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  } ${!isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {profile.isPublic ? (
                    <>
                      <Eye size={18} className="mr-2" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={18} className="mr-2" />
                      <span>Private</span>
                    </>
                  )}
                </button>
              </div>

              <button className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-purple-600 rounded-md hover:bg-purple-700">
                <Eye size={18} className="mr-2" />
                View My Public Page
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Info */}
        <div className="col-span-1 lg:col-span-2">
          <div className="p-6 rounded-lg bg-gray-50">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    setValidationErrors({});
                    setFieldErrors({});
                    setImagePreview(null);
                    setProfileImage(null);
                  }
                }}
                className="text-blue-600 hover:text-blue-800"
                disabled={isSubmitting}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Organizer/Brand Name *
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      maxLength={100}
                      className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.name || validationErrors.name
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    <ErrorMessage
                      error={fieldErrors.name || validationErrors.name}
                    />
                  </>
                ) : (
                  <p className="p-3 bg-white border border-gray-200 rounded-md">
                    {profile.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center block mb-1 text-sm font-medium text-gray-700">
                  <Mail size={16} className="mr-2" />
                  Email Address
                </label>
                <p className="p-3 text-gray-500 bg-white border border-gray-200 rounded-md">
                  {profile.email}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center block mb-1 text-sm font-medium text-gray-700">
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.phone || validationErrors.phone
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="+1234567890"
                    />
                    <ErrorMessage
                      error={fieldErrors.phone || validationErrors.phone}
                    />
                  </>
                ) : (
                  <p className="p-3 bg-white border border-gray-200 rounded-md">
                    {profile.phone}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Bio / About
                </label>
                {isEditing ? (
                  <>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows={4}
                      maxLength={1000}
                      className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.bio || validationErrors.bio
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-between">
                      <ErrorMessage
                        error={fieldErrors.bio || validationErrors.bio}
                      />
                      <span className="text-sm text-gray-500">
                        {profile.bio.length}/1000
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="p-3 bg-white border border-gray-200 rounded-md">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="flex items-center block mb-1 text-sm font-medium text-gray-700">
                  <Globe size={16} className="mr-2" />
                  Website
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.website || validationErrors.website
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="https://www.example.com"
                    />
                    <ErrorMessage
                      error={fieldErrors.website || validationErrors.website}
                    />
                  </>
                ) : (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 text-blue-600 bg-white border border-gray-200 rounded-md hover:text-blue-800"
                  >
                    {profile.website}
                  </a>
                )}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="mb-3 font-medium text-gray-700 text-md">
                  Social Media
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Instagram size={20} className="mr-3 text-pink-600" />
                    {isEditing ? (
                      <div className="flex-1">
                        <input
                          type="text"
                          name="social.instagram"
                          value={profile.social.instagram}
                          onChange={handleChange}
                          placeholder="Instagram username"
                          maxLength={30}
                          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            fieldErrors["social.instagram"] ||
                            validationErrors.instagram
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          error={
                            fieldErrors["social.instagram"] ||
                            validationErrors.instagram
                          }
                        />
                      </div>
                    ) : (
                      <span>@{profile.social.instagram}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Facebook size={20} className="mr-3 text-blue-600" />
                    {isEditing ? (
                      <div className="flex-1">
                        <input
                          type="text"
                          name="social.facebook"
                          value={profile.social.facebook}
                          onChange={handleChange}
                          placeholder="Facebook username"
                          maxLength={30}
                          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            fieldErrors["social.facebook"] ||
                            validationErrors.facebook
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          error={
                            fieldErrors["social.facebook"] ||
                            validationErrors.facebook
                          }
                        />
                      </div>
                    ) : (
                      <span>{profile.social.facebook}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Linkedin size={20} className="mr-3 text-blue-700" />
                    {isEditing ? (
                      <div className="flex-1">
                        <input
                          type="text"
                          name="social.linkedin"
                          value={profile.social.linkedin}
                          onChange={handleChange}
                          placeholder="LinkedIn username"
                          maxLength={30}
                          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            fieldErrors["social.linkedin"] ||
                            validationErrors.linkedin
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          error={
                            fieldErrors["social.linkedin"] ||
                            validationErrors.linkedin
                          }
                        />
                      </div>
                    ) : (
                      <span>{profile.social.linkedin}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Categories */}
              <div>
                <h3 className="mb-3 font-medium text-gray-700 text-md">
                  Event Categories ({profile.categories.length}/10)
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                    >
                      {category}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-2 text-blue-800 hover:text-blue-900"
                          type="button"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add category"
                        maxLength={50}
                        className={`flex-1 p-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.newCategory
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddCategory}
                        className="px-4 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                        type="button"
                        disabled={
                          !newCategory.trim() || profile.categories.length >= 10
                        }
                      >
                        Add
                      </button>
                    </div>
                    <ErrorMessage error={validationErrors.newCategory} />
                  </div>
                )}
                <ErrorMessage error={validationErrors.categories} />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <button
                  onClick={handleSaveChanges}
                  disabled={
                    isSubmitting ||
                    Object.values(fieldErrors).some((error) => error)
                  }
                  className="flex items-center px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} className="mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

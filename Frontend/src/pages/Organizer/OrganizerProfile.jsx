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
} from "lucide-react";
import {
  fetchOrganizerProfile,
  updateOrganizerProfile,
} from "../../Redux/Slicers/OrganizerSlice"; // Adjust path as needed

export default function OrganizerProfile() {
  const dispatch = useDispatch();
  const { organizerProfile, loading, error } = useSelector(
    (state) => state.organizer
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [profileImage, setProfileImage] = useState(null);
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

  // Fetch profile data when component mounts
  useEffect(() => {
    dispatch(fetchOrganizerProfile());
  }, [dispatch]);

  // Update local state when profile data is received from Redux
  useEffect(() => {
    if (organizerProfile) {
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
  }, [organizerProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (newCategory && !profile.categories.includes(newCategory)) {
      setProfile({
        ...profile,
        categories: [...profile.categories, newCategory],
      });
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setProfile({
      ...profile,
      categories: profile.categories.filter((cat) => cat !== category),
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    // Map the component state to what the backend expects
    const organizerData = {
      username: profile.name,
      phone: profile.phone,
      bio: profile.bio,
      website: profile.website,
      instagram: profile.social.instagram,
      facebook: profile.social.facebook,
      linkedin: profile.social.linkedin,
      categories: profile.categories,
      isPublic: profile.isPublic,
    };

    // Add profile image if one was selected
    if (profileImage) {
      organizerData.profileImage = profileImage;
    }

    // Dispatch the update action
    dispatch(updateOrganizerProfile(organizerData))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        // Reset profile image selection
        setProfileImage(null);
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
      });
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Picture */}
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-200 rounded-full">
                {organizerProfile?.profileImage ? (
                  <img
                    src={organizerProfile.profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src="/api/placeholder/200/200"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                )}
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
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="w-full mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Public Profile
                </h3>
                <button
                  onClick={handleTogglePublic}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    profile.isPublic
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
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
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Organizer/Brand Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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
                  <input
                    type="text"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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
                      <input
                        type="text"
                        name="social.instagram"
                        value={profile.social.instagram}
                        onChange={handleChange}
                        placeholder="Instagram username"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span>@{profile.social.instagram}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Facebook size={20} className="mr-3 text-blue-600" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="social.facebook"
                        value={profile.social.facebook}
                        onChange={handleChange}
                        placeholder="Facebook username"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span>{profile.social.facebook}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Linkedin size={20} className="mr-3 text-blue-700" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="social.linkedin"
                        value={profile.social.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn username"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span>{profile.social.linkedin}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Categories */}
              <div>
                <h3 className="mb-3 font-medium text-gray-700 text-md">
                  Event Categories
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
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-4 text-white bg-blue-600 rounded-r-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

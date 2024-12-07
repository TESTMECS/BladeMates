import React, { useState } from "react";
import { useAuth } from "../context/userContext";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    bio: user?.bio || "Tech enthusiast and software developer.",
    profileImage: user?.profileImage || "https://via.placeholder.com/128",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUser(formData); // Update user data in context
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-lightpink text-black dark:bg-purple dark:text-white dark:hover:bg-green hover:bg-lightblue rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/128"
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
          {!isEditing ? (
            <div>
              <h2 className="text-2xl font-semibold ">{formData.name}</h2>
              <p className="text-gray">@{user?.username || "johndoe"}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-lightblue text-white rounded-md p-2 w-full "
                placeholder="Name"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="border border-lightblue text-white rounded-md p-2 w-full"
                placeholder="Bio"
              />
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const syntheticEvent = {
                          target: {
                            name: "profileImage",
                            value: reader.result as string,
                          },
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleChange(syntheticEvent);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="profileImageUpload"
                />
                <label
                  htmlFor="profileImageUpload"
                  className="cursor-pointer px-4 py-2 rounded-md hover:bg-gray transition-colors duration-200"
                >
                  Choose Image
                </label>
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-green text-black rounded-md hover:bg-purple transition-colors duration-200"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {!isEditing && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
            <p className="text-gray-600">{formData.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

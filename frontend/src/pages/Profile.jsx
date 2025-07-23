import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const avatarOptions = [
  "👩‍💻", "🧑‍🔬", "👨‍🎓", "🧑‍🎨",
  "👩‍🚀", "👨‍🚒", "👩‍🏫", "👨‍⚖️",
  "🧑‍💼", "🧑‍💻",
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setTempName(storedUser.name || "");
      setTempAvatar(storedUser.avatar || avatarOptions[0]);
    }
  }, []);

  const handleSave = () => {
    const updatedUser = { ...user, name: tempName, avatar: tempAvatar };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handlePasswordReset = async () => {
    if (!user.email) return alert("Enter your email first.");
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Password reset email sent!");
    } catch (err) {
      alert("Failed to send reset email: " + err.message);
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        You must be logged in to view your profile.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 md:px-10 py-6">
      <h2 className="text-3xl text-blue-700 font-semibold text-center mb-6">
        Your Profile
      </h2>
      <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4 text-center">
        <div className="text-5xl mb-2">{user.avatar || "👤"}</div>

        {isEditing && (
          <div className="flex justify-center gap-2 flex-wrap mb-2">
            {avatarOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setTempAvatar(emoji)}
                className={`text-3xl p-2 rounded-full border ${
                  tempAvatar === emoji
                    ? "border-blue-600"
                    : "border-transparent"
                } hover:scale-110 transition`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div>
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          ) : (
            user.name || "N/A"
          )}
        </div>

        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Joined:</strong> {user.createdAt || "N/A"}
        </p>

        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
        <p
          className="text-sm text-indigo-600 mt-2 cursor-pointer"
          onClick={handlePasswordReset}
        >
          Forgot password?
        </p>
      </div>
    </div>
  );
};

export default Profile;

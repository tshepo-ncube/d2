"use client";
import React, { useEffect, useState } from "react";
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const [userEmail, setUserEmail] = useState(null);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    ManageUser.logoutUser(setLoggedIn, router);
  };

  const [profile, setProfile] = useState({});
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password",
    allergies: ["Nuts"],
    injuries: "None",
    diet: "None",
  });

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    allergies: user.allergies.join(", "),
    injuries: user.injuries,
    diet: user.diet,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const getEmailFromLocalStorage = () => {
    const savedEmail = localStorage.getItem("Email");
    return savedEmail || ""; // Return empty string if no email is found
  };

  useEffect(() => {
    // const auth = getAuth();
    // const unsubscribe = onAuthStateChanged(auth, (user_h) => {
    //   if (user_h) {
    //     // User is signed in.
    //     console.log("User is logged in:", user_h);
    //     setUserEmail(user_h.email);
    //     //setSignedIn(true);

    //     // User is signed in.
    //     //setUser(user);

    //     //window.location.href = "http://localhost:3000/Home";
    //   } else {
    //     // setSignedIn(false);
    //     // setUser(null);
    //     // No user is signed in.
    //     console.log("No user is logged in");
    //   }
    // });

    ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);

    // To stop listening for changes (unsubscribe) - optional
    // return () => unsubscribe();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "personalDetails") {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        allergies: formData.allergies.split(",").map((item) => item.trim()),
        injuries: formData.injuries,
      };
      setUser(updatedUser);
    } else if (activeTab === "passwordReset") {
      // Handle password reset logic
    }
  };

  const handleNewPasswordSubmit = () => {
    if (formData.newPassword == formData.confirmNewPassword) {
      ManageUser.editPassword(formData.newPassword, setError);
    } else {
      alert("Confirm Password does not equal to password!");
    }
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const success = await ManageUser.editProfileData(profile.id, profile);
    if (success) {
      // If the profile update was successful, fetch the updated profile data
      ManageUser.getProfileData("tshepo@tshepo.com", setProfile);
    } else {
      // Handle failure
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full sm:w-2/3 lg:w-1/2 px-6 py-4 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-semibold mb-4">User Settings</h1>
        {/* <div className="flex">
          <ul className="w-1/4 pr-4">
            <li
              className={`cursor-pointer mb-2 ${
                activeTab === "personalDetails" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("personalDetails")}
            >
              Personal Details
            </li>
            <li
              className={`cursor-pointer mb-2 ${
                activeTab === "passwordReset" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("passwordReset")}
            >
              Password Reset
            </li>
            <li
              className={`cursor-pointer mb-2 ${
                activeTab === "logout" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("logout")}
            >
              Log Out
            </li>
          </ul>
          <div className="w-3/4">
            {activeTab === "personalDetails" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    First Name:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lastName"
                  >
                    Last Name:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="allergies"
                  >
                    Food Allergies:
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    id="allergies"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="injuries"
                  >
                    Injuries:
                  </label>
                  <textarea
                    name="injuries"
                    id="injuries"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.injuries}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline focus:shadow-outline hover:shadow-md"
                  >
                    Save Personal Details
                  </button>
                </div>
              </form>
            )}
            {activeTab === "passwordReset" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="currentPassword"
                  >
                    Current Password:
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    New Password:
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmNewPassword"
                  >
                    Confirm New Password:
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline hover:shadow-md"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            )}
            {activeTab === "logout" && (
              <div>
                <p>Are you sure you want to log out?</p>
                <button
                  onClick={handleLogout}
                  className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:shadow-md"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div> */}

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper", //green
            display: "flex",
            padding: 2,
            height: "200",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={profile.Name}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="Personal Details" {...a11yProps(0)} />
            <Tab label="Password Reset" {...a11yProps(1)} />
            <Tab label="Log Out" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <form onSubmit={handleEditProfileSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  name="Name"
                  id="firstName"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  name="Surname"
                  id="lastName"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Surname}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  type="email"
                  name="Email"
                  id="email"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Email}
                  onChange={handleProfileChange}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="allergies"
                >
                  Dietary Requirements:
                </label>
                <input
                  type="text"
                  name="Diet"
                  id="diet"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Diet}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="allergies"
                >
                  Food Allergies:
                </label>
                <input
                  type="text"
                  name="Allergies"
                  id="allergies"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Allergies}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="injuries"
                >
                  Injuries:
                </label>
                <textarea
                  name="Injuries"
                  id="injuries"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Injuries}
                  onChange={handleProfileChange}
                ></textarea>
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline focus:shadow-outline hover:shadow-md"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <form onSubmit={handleNewPasswordSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password:
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password:
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline hover:shadow-md"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div>
              <p>Are you sure you want to log out?</p>
              <button
                onClick={handleLogout}
                className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:shadow-md"
              >
                Log out
              </button>
            </div>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default Profile;

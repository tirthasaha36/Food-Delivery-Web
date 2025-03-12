const API_URL = "http://localhost:5000/api/users"; // Change this if your backend URL is different

// Function to register a new user
export const registerUser = async (name, email, password) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, message: error.message };
  }
};

// Function to log in a user
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token); // Store JWT in localStorage
    return { success: true, user: data.user, message: "Login successful" };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: error.message };
  }
};

// Function to fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return { success: false, message: "Failed to load profile. Please login again." };
  }
};

// Function to update user profile
export const updateUserProfile = async (name, email, password) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    return { success: true, user: data.user, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile Update Error:", error);
    return { success: false, message: error.message };
  }
};

// Function to logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  return { success: true, message: "Logged out successfully" };
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Returns true if token exists
};

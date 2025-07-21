import { jwtDecode } from "jwt-decode";

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.nameid,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      isBanned: decoded.isBanned,
      phone: decoded.phone
    };
  } catch {
    return null;
  }
}

export async function getCurrentUserAPI(userId,token){
   try {
    const response = await fetch(`https://localhost:7013/api/User/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching user from API:", error);
    return null;
  }
}


export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === "Admin";
}
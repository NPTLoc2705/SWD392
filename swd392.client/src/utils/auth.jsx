import jwtDecode from "jwt-decode";

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
    };
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === "Admin";
}
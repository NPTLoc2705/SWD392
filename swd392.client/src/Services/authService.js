// export const login = async (email, password) => {
//     // Gọi API login, trả về token nếu thành công
//     const res = await fetch('https://localhost:7013/api/Auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) throw new Error('Login failed');
//     const data = await res.json();
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     return data.user;
// };

// export const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
// };

// export const getUser = () => {
//     return JSON.parse(localStorage.getItem('user'));
// };

// export const isAuthenticated = () => {
//     return !!localStorage.getItem('token');
// };

// export const register = async (email, password, name, phone) => {
//     const res = await fetch('https://localhost:7013/api/Auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password, phone }),
//     });
//     if (!res.ok) {
//         let msg = "Register failed";
//         try {
//             const err = await res.json();
//             msg = err.message || JSON.stringify(err) || msg;
//         } catch (err) {
//             console.error("Error parsing response:", err);
//         }
//         throw new Error(msg);
//     }
//     return await res.json();
// };
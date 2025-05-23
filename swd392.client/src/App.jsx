import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false);

    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: '377229581554-3jvl3aj56jrmof4dnbjnrsudhs6uqmtf.apps.googleusercontent.com',
                    callback: handleGoogleLogin
                });

                if (!user) {
                    window.google.accounts.id.renderButton(
                        document.getElementById('google-signin-button'),
                        {
                            theme: 'outline',
                            size: 'large',
                            width: '100%',
                            text: 'signin_with'
                        }
                    );
                }
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleGoogleLogin = async (response) => {
        try {
            setLoading(true);
            setError('');

            const result = await fetch('https://localhost:7013/api/Auth/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ IdToken: response.credential }),
            });

            if (result.ok) {
                const data = await result.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                const errorData = await result.json();
                setError(errorData.message || 'Google login failed');
            }
        } catch {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('https://localhost:7013/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('https://localhost:7013/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerForm),
            });

            if (response.ok) {
                setShowRegister(false);
                setError('Registration successful! Please login.');
                setRegisterForm({ name: '', email: '', phone: '', password: '' });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } catch {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('https://localhost:7013/api/Student/GetStudent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                setError('Failed to fetch students');
            }
        } catch {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setStudents([]);
    };

    if (user) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                            Logout
                        </button>
                    </div>

                    <div className="mb-6">
                        <button onClick={fetchStudents} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 transition-colors">
                            {loading ? 'Loading...' : 'Load Students'}
                        </button>
                    </div>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                    {students.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{student.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{student.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{student.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {showRegister ? 'Register' : 'Login'}
                </h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                {!showRegister ? (
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div id="google-signin-button"></div>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button onClick={() => setShowRegister(true)} className="text-blue-500 hover:text-blue-600">Register here</button>
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={registerForm.name}
                                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={registerForm.email}
                                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={registerForm.phone}
                                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={registerForm.password}
                                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button onClick={() => setShowRegister(false)} className="text-blue-500 hover:text-blue-600">Login here</button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <MapPin size={24} />
                <span>LocalShare</span>
            </Link>
            <div className="flex gap-4 items-center">
                {user ? (
                    <>
                        <div className="flex items-center gap-1 text-gray-600">
                            <User size={18} />
                            <span>{user.username || 'User'}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

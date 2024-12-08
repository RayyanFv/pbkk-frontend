// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    HomeIcon, 
    ShoppingCartIcon, 
    ClipboardDocumentListIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#EF4444',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                navigate('/login');
            }
        });
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Products', path: '/products', icon: ShoppingCartIcon },
        { name: 'Transactions', path: '/transactions', icon: ClipboardDocumentListIcon },
        { name: 'Users', path: '/users', icon: UserIcon },
    ];

    if (userRole === 'admin') {
        menuItems.push({ name: 'Users', path: '/users', icon: UserIcon });
    }

    return (
        <>
            {/* Top Navbar */}
            <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold text-gray-800">POS System</span>
                            </div>
                            
                            {/* Desktop Menu */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-600"
                                    >
                                        <item.icon className="h-5 w-5 mr-1" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right side menu */}
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                                Logout
                            </button>

                            {/* Mobile menu button */}
                            <div className="sm:hidden ml-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                                >
                                    {isMobileMenuOpen ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;
// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LockClosedIcon, UserIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const showSuccessAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome back to POS System',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            customClass: {
                popup: 'rounded-2xl',
                title: 'text-xl font-bold text-gray-800',
                content: 'text-gray-600'
            }
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'Try Again',
            customClass: {
                popup: 'rounded-2xl',
                title: 'text-xl font-bold text-gray-800',
                content: 'text-gray-600',
                confirmButton: 'rounded-xl'
            }
        });
    };

    const showLoadingAlert = () => {
        Swal.fire({
            title: 'Logging In',
            html: 'Accessing your account...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            },
            customClass: {
                popup: 'rounded-2xl',
                title: 'text-xl font-bold text-gray-800',
                content: 'text-gray-600'
            }
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        showLoadingAlert();

        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password,
            });
            
            // Close loading alert
            Swal.close();
            
            // Show success alert
            showSuccessAlert();
            
            // Save user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            
            // Delay navigation to show success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (err) {
            Swal.close(); // Close loading alert
            
            let errorMessage = 'Invalid username or password';
            
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        errorMessage = 'Invalid username or password';
                        break;
                    case 403:
                        errorMessage = 'Your account has been locked. Please contact admin.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = err.response.data.message || errorMessage;
                }
            }
            
            showErrorAlert(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Original JSX remains the same
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-300 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-10">
                        {/* Logo */}
                        <div className="h-20 w-20 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                            <ShoppingCartIcon className="h-12 w-12 text-white transform -rotate-12" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">POS System</h2>
                        <p className="text-gray-600">Access your point of sale dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r animate-shake">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                                    placeholder="Enter your staff username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {/* Remember Me & Shift Options */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember this device
                                </label>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Need help?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px]"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Access POS System'
                            )}
                        </button>

                        {/* Register Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                New staff member?{' '}
                                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                    Register Here
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Store Hours Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-500">
                            Store Hours: Mon-Sat 8AM-10PM | Support: 0851-5887-9780
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
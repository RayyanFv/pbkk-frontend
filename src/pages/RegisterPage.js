// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LockClosedIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'cashier'
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showSuccessAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Your staff account has been created. You can now login.',
            showConfirmButton: true,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'Go to Login',
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'rounded-2xl',
                title: 'text-xl font-bold text-gray-800',
                content: 'text-gray-600',
                confirmButton: 'rounded-xl'
            }
        }).then((result) => {
            navigate('/login');
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
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

    const showPasswordMismatchAlert = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Password Mismatch',
            text: 'The passwords you entered do not match. Please try again.',
            showConfirmButton: true,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'OK',
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
            title: 'Creating Account',
            html: 'Please wait while we set up your staff account...',
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

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            showPasswordMismatchAlert();
            return;
        }

        try {
            setIsLoading(true);
            showLoadingAlert();

            const registerData = {
                username: formData.username,
                password: formData.password,
                role: formData.role
            };

            await axios.post('http://localhost:8080/register', registerData);
            
            Swal.close();
            showSuccessAlert();
            
        } catch (err) {
            Swal.close();
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        errorMessage = 'Invalid input. Please check your details.';
                        break;
                    case 409:
                        errorMessage = 'Username already exists. Please choose another.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = err.response.data.message || errorMessage;
                }
            }
            
            showErrorAlert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-300 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-10">
                        
                        <div className="h-20 w-20 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                            <UserGroupIcon className="h-12 w-12 text-white transform -rotate-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Registration</h2>
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">POS System Access</h3>
                        <p className="text-gray-600">Create your staff account</p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Staff Username
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
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                                    placeholder="Choose your username"
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                                    placeholder="Choose a strong password"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Staff Role
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserGroupIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
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
                                'Create Staff Account'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-500">
                            By registering, you agree to the staff policies and procedures
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
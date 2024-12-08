// src/pages/CreateTransactionPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const CreateTransactionPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/auth/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load products'
            });
            setIsLoading(false);
        }
    };

    const addProductToTransaction = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) return;

        if (product.stock <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Out of Stock',
                text: 'This product is currently out of stock'
            });
            return;
        }

        const existingProduct = selectedProducts.find(p => p.id === product.id);
        if (existingProduct) {
            Swal.fire({
                icon: 'warning',
                title: 'Product Already Added',
                text: 'This product is already in your transaction'
            });
            return;
        }

        setSelectedProducts([
            ...selectedProducts,
            {
                ...product,
                quantity: 1,
                total_price: product.price
            }
        ]);
    };

    const updateQuantity = (productId, quantity) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (quantity > product.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Not Enough Stock',
                text: `Only ${product.stock} items available`
            });
            return;
        }

        setSelectedProducts(selectedProducts.map(item => 
            item.id === productId
                ? { ...item, quantity, total_price: quantity * item.price }
                : item
        ));
    };

    const removeProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((total, item) => total + item.total_price, 0);
    };

    const handleSubmit = async () => {
        if (!customerId || selectedProducts.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Transaction',
                text: 'Please enter customer ID and add products'
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const transactionData = {
                customer_id: parseInt(customerId),
                total_amount: calculateTotal(),
                items: selectedProducts.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    total_price: item.total_price
                }))
            };

            const response = await axios.post(
                'http://localhost:8080/auth/transactions',
                transactionData,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Transaction created successfully'
                });
                navigate('/transactions');
            }
        } catch (error) {
            console.error('Transaction error:', error.response?.data);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Failed to create transaction'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Create New Transaction</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Selection */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Add Products</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                        <input
                            type="number"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter customer ID"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Select Product</label>
                        <select
                            onChange={(e) => addProductToTransaction(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value=""
                        >
                            <option value="" disabled>Choose a product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ${product.price} (Stock: {product.stock})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Selected Products */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Selected Products</h2>
                    <div className="space-y-4">
                        {selectedProducts.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-2">
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">${item.price} each</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        min="1"
                                        max={item.stock}
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <p className="w-24 text-right">${item.total_price.toFixed(2)}</p>
                                    <button
                                        onClick={() => removeProduct(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {selectedProducts.length === 0 && (
                            <p className="text-center text-gray-500">No products selected</p>
                        )}

                        {selectedProducts.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Total Amount:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={() => navigate('/transactions')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={selectedProducts.length === 0 || !customerId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Create Transaction
                </button>
            </div>
        </div>
    );
};

export default CreateTransactionPage;
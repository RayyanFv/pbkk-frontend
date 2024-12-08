// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    ShoppingBagIcon, 
    CubeIcon, 
    UserGroupIcon, 
    CurrencyDollarIcon 
} from '@heroicons/react/24/solid';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import Swal from 'sweetalert2';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalSales: 0,
            totalProducts: 0,
            totalTransactions: 0,
            dailyRevenue: 0
        },
        transactions: [],
        products: [],
        stockLevels: []
    });
    const [isLoading, setIsLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch multiple data points in parallel
            const [transactionsRes, productsRes] = await Promise.all([
                axios.get('http://localhost:8080/auth/transactions', { headers }),
                axios.get('http://localhost:8080/auth/products', { headers })
            ]);

            // Process transactions data
            const transactions = transactionsRes.data || [];
            const products = productsRes.data || [];

            // Calculate statistics
            const totalSales = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
            const dailyRevenue = transactions
                .filter(t => new Date(t.created_at).toDateString() === new Date().toDateString())
                .reduce((sum, t) => sum + (t.total_amount || 0), 0);

            // Prepare data for charts
            const stockLevels = products.map(p => ({
                name: p.name,
                stock: p.stock,
                value: p.stock // for pie chart
            }));

            // Group transactions by date for trend analysis
            const transactionsByDate = groupTransactionsByDate(transactions);

            setDashboardData({
                stats: {
                    totalSales,
                    totalProducts: products.length,
                    totalTransactions: transactions.length,
                    dailyRevenue
                },
                transactions: transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
                products,
                stockLevels,
                transactionTrend: transactionsByDate
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load dashboard data'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const groupTransactionsByDate = (transactions) => {
        const grouped = transactions.reduce((acc, t) => {
            const date = new Date(t.created_at).toLocaleDateString();
            if (!acc[date]) acc[date] = { date, total: 0, count: 0 };
            acc[date].total += t.total_amount;
            acc[date].count += 1;
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${color}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, here's your store's performance overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Sales"
                    value={`$${dashboardData.stats.totalSales.toLocaleString()}`}
                    icon={<CurrencyDollarIcon className="w-6 h-6 text-green-500" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Total Products"
                    value={dashboardData.stats.totalProducts}
                    icon={<CubeIcon className="w-6 h-6 text-blue-500" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Daily Revenue"
                    value={`$${dashboardData.stats.dailyRevenue.toLocaleString()}`}
                    icon={<ShoppingBagIcon className="w-6 h-6 text-purple-500" />}
                    color="bg-purple-100"
                />
                <StatCard
                    title="Total Transactions"
                    value={dashboardData.stats.totalTransactions}
                    icon={<UserGroupIcon className="w-6 h-6 text-orange-500" />}
                    color="bg-orange-100"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales Trend Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.transactionTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" name="Sales ($)" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Levels Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dashboardData.stockLevels}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {dashboardData.stockLevels.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        #{transaction.customer_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${transaction.total_amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.items?.length || 0} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(transaction.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
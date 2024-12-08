// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import TransactionsPage from './pages/TransactionsPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import CreateTransactionPage from './pages/CreateTransactionPage';
function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <DashboardPage />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/products" element={
                    <ProtectedRoute>
                        <Layout>
                            <ProductsPage />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/transactions" element={
                    <ProtectedRoute>
                        <Layout>
                            <TransactionsPage />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                    <ProtectedRoute>
                        <Layout>
                            <UsersPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                // Di dalam routes di App.js
<Route path="/transactions/create" element={
    <ProtectedRoute>
        <Layout>
            <CreateTransactionPage />
        </Layout>
    </ProtectedRoute>
} />

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/products">Manage Products</Link></li>
                <li><Link to="/sales-report">Sales Report</Link></li>
                <li><Link to="/stocks">Stock Management</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;

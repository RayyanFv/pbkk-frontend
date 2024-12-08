// src/components/Card.js
import React from 'react';

const Card = ({ title, value, icon }) => {
    return (
        <div className="card">
            <div className="card-icon">{icon}</div>
            <div className="card-title">{title}</div>
            <div className="card-value">{value}</div>
        </div>
    );
};

export default Card;

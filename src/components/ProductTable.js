// src/components/ProductTable.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductTable = ({ products, onDelete }) => {
    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                            <Link to={`/products/${product.id}/edit`}>Edit</Link>
                            <button onClick={() => onDelete(product.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductTable;

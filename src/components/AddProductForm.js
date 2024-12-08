// src/components/AddProductForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AddProductForm() {
    const navigate = useNavigate(); // Ganti useHistory dengan useNavigate
    const { id } = useParams(); // Ambil parameter id dari URL jika ada
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    // Jika id tersedia (untuk edit produk), ambil data produk
    useEffect(() => {
        if (id) {
            axios.get(`/auth/products/${id}`)
                .then(response => {
                    const product = response.data;
                    setName(product.name);
                    setCategory(product.category);
                    setPrice(product.price);
                    setStock(product.stock);
                })
                .catch(error => console.error(error));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = { name, category, price, stock };

        if (id) {
            // Jika ada id, update produk
            axios.put(`/auth/products/${id}`, productData)
                .then(response => {
                    alert("Product updated successfully!");
                    navigate('/products'); // Navigasi setelah update
                })
                .catch(error => console.error(error));
        } else {
            // Jika tidak ada id, buat produk baru
            axios.post('/auth/products', productData)
                .then(response => {
                    alert("Product created successfully!");
                    navigate('/products'); // Navigasi setelah berhasil
                })
                .catch(error => console.error(error));
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input 
                        type="text" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Stock</label>
                    <input 
                        type="number" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                    />
                </div>
                <button type="submit">{id ? 'Update Product' : 'Add Product'}</button>
            </form>
        </div>
    );
}

export default AddProductForm;

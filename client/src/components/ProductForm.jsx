import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Upload } from 'lucide-react';

const ProductForm = ({ product, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '1', // Default category
        weight_quantity: '',
        weight_unit: 'kg',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Sync stock_quantity with weight_quantity
    useEffect(() => {
        setFormData(prev => ({ ...prev, stock_quantity: prev.weight_quantity }));
    }, [formData.weight_quantity]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
            if (!product && response.data.length > 0) {
                setFormData(prev => ({ ...prev, category_id: response.data[0].category_id }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock_quantity: product.stock_quantity,
                category_id: product.category_id || '1',
                weight_quantity: product.weight_quantity || '',
                weight_unit: product.weight_unit || 'kg',
            });
        }
    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock_quantity', formData.stock_quantity);
        data.append('category_id', formData.category_id);
        data.append('weight_quantity', formData.weight_quantity);
        data.append('weight_unit', formData.weight_unit);
        if (image) {
            data.append('image', image);
        }

        try {
            if (product) {
                await api.put(`/products/${product.id}`, formData); // Update (image upload for update separate or unimplemented in basic version)
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4 overflow-hidden">
            <div className="card-header bg-white d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0 fw-bold text-dark">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button onClick={onClose} className="btn btn-link text-secondary p-0 text-decoration-none">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card-body p-4">
                <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    ></textarea>
                </div>

                <div className="row g-3 mb-3">
                    <div className="col-4">
                        <label className="form-label fw-bold small text-secondary">Price</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-4">
                        <label className="form-label fw-bold small text-secondary">Weight/Qty</label>
                        <input
                            type="number"
                            name="weight_quantity"
                            step="0.01"
                            required
                            value={formData.weight_quantity}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g. 500"
                        />
                    </div>
                    <div className="col-4">
                        <label className="form-label fw-bold small text-secondary">Unit</label>
                        <select
                            name="weight_unit"
                            value={formData.weight_unit}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="pcs">pcs</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-4">
                        <label className="form-label fw-bold small text-secondary">Category</label>
                        <select
                            name="category_id"
                            required
                            value={formData.category_id}
                            onChange={handleChange}
                            className="form-select form-select-sm"
                        >
                            {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {!product && (
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary">Product Image</label>
                        <div className="w-100">
                            <label className="d-flex flex-column align-items-center justify-content-center w-100 p-4 border border-2 border-secondary-subtle border-dashed rounded bg-light cursor-pointer hover-bg-light-subtle" style={{ borderStyle: 'dashed' }}>
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                    <Upload className="mb-2 text-secondary" size={32} />
                                    <p className="small text-secondary mb-0"><span className="fw-semibold">Click to upload</span></p>
                                </div>
                                <input type="file" className="d-none" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                        {image && <p className="small text-success mt-2">Selected: {image.name}</p>}
                    </div>
                )}

                <div className="d-flex justify-content-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-light"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;

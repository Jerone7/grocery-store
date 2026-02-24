import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import { Plus, LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleFormSubmit = async () => {
        setIsFormOpen(false);
        fetchProducts();
    };

    return (
        <div className="d-flex vh-100 bg-light">
            {/* Sidebar */}
            <aside className="d-none d-md-flex flex-column bg-white shadow" style={{ width: '250px' }}>
                <div className="p-4">
                    <h1 className="h4 fw-bold text-dark d-flex align-items-center gap-2">
                        <Package className="text-primary" />
                        Store Admin
                    </h1>
                </div>
                <nav className="flex-grow-1 px-3">
                    <a href="#" className="d-flex align-items-center gap-2 p-3 text-primary bg-primary-subtle rounded text-decoration-none">
                        <Package size={20} />
                        Products
                    </a>
                    {/* Add more links here */}
                </nav>
                <div className="p-3 border-top">
                    <button
                        onClick={handleLogout}
                        className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 w-100 p-2"
                        style={{ boxShadow: 'none' }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow-1 overflow-auto p-4">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h2 fw-bold text-dark">Products</h2>
                    <button
                        onClick={handleAddProduct}
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </header>

                <ProductTable
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            </main>

            {/* Floating Modal for Product Form */}
            {isFormOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsFormOpen(false);
                    }}
                >
                    <div style={{ width: '100%', maxWidth: '900px' }}>
                        <ProductForm
                            product={editingProduct}
                            onClose={() => setIsFormOpen(false)}
                            onSubmit={handleFormSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

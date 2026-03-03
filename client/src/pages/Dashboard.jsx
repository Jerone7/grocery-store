import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import OrderTable from '../components/OrderTable';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { Plus, LogOut, Package, ShoppingBag, Users, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const isProductEnabled = (value) => {
    if (value === true || value === 1 || value === '1' || value === 'true') {
        return true;
    }

    if (value && typeof value === 'object' && Array.isArray(value.data)) {
        return value.data[0] === 1;
    }

    return false;
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products?include_disabled=true');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
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

    const handleToggleProductStatus = async (product) => {
        const currentlyEnabled = isProductEnabled(product.is_enabled);
        const nextStatus = currentlyEnabled ? 0 : 1;

        // Optimistic update
        const updatedProducts = products.map(p =>
            p.id === product.id ? { ...p, is_enabled: nextStatus } : p
        );
        setProducts(updatedProducts);

        try {
            await api.patch(`/products/${product.id}/status`, { is_enabled: nextStatus });
            // No need to fetch all products again if the update was successful
            // But we can do it to ensure sync, or just rely on the local state
        } catch (error) {
            console.error(`Error trying to toggle product status:`, error);
            // Revert state on error
            setProducts(products);
            alert('Failed to update product status');
        }
    };

    const handleViewOrder = (order) => {
        setViewingOrder(order);
    };

    return (
        <div className="d-flex vh-100 bg-light">
            {/* Sidebar */}
            <aside className="d-none d-md-flex flex-column bg-white shadow-sm border-end" style={{ width: '260px', zIndex: 100 }}>
                <div className="p-4 mb-2">
                    <h1 className="h4 fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                        <div className="bg-primary rounded-3 p-1">
                            <Package className="text-white" size={24} />
                        </div>
                        <span className="tracking-tight">StoreAdmin</span>
                    </h1>
                </div>

                <nav className="flex-grow-1 px-3 py-2">
                    <div className="small text-uppercase text-secondary fw-bold mb-2 px-3 opacity-50">Menu</div>

                    <button
                        onClick={() => setActiveTab('products')}
                        className={`btn d-flex align-items-center justify-content-between w-100 p-3 mb-2 rounded-3 text-start border-0 transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <Package size={20} />
                            <span className="fw-medium">Products</span>
                        </div>
                        {activeTab === 'products' && <ChevronRight size={16} />}
                    </button>

                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`btn d-flex align-items-center justify-content-between w-100 p-3 mb-2 rounded-3 text-start border-0 transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <ShoppingBag size={20} />
                            <span className="fw-medium">Orders</span>
                        </div>
                        {activeTab === 'orders' && <ChevronRight size={16} />}
                    </button>
                </nav>

                <div className="p-4 border-top">
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100 py-2 rounded-3 fw-medium"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow-1 overflow-auto">
                <div className="container-fluid p-4 p-lg-5">
                    <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                        <div>
                            <div className="text-primary small fw-bold text-uppercase tracking-wider mb-1">
                                {activeTab === 'products' ? 'Inventory' : 'Sales'} Management
                            </div>
                            <h2 className="h2 fw-bold text-dark mb-0">
                                {activeTab === 'products' ? 'Product Catalog' : 'Order History'}
                            </h2>
                        </div>

                        {activeTab === 'products' && (
                            <button
                                onClick={handleAddProduct}
                                className="btn btn-primary btn-lg d-flex align-items-center gap-2 shadow-sm px-4 rounded-3 py-2 fw-bold"
                            >
                                <Plus size={22} />
                                Add New Product
                            </button>
                        )}
                    </header>

                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <div className="text-secondary fw-medium">Fetching your data...</div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            {activeTab === 'products' ? (
                                <ProductTable
                                    products={products}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                    onToggleStatus={handleToggleProductStatus}
                                />
                            ) : (
                                <OrderTable
                                    orders={orders}
                                    onViewDetails={handleViewOrder}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Product Form */}
            {isFormOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1050, backdropFilter: 'blur(4px)' }}
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

            {/* Modal for Order Details */}
            {viewingOrder && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1050, backdropFilter: 'blur(4px)' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setViewingOrder(null);
                    }}
                >
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <OrderDetailsModal
                            order={viewingOrder}
                            onClose={() => setViewingOrder(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

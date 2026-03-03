import React, { useState, useEffect } from 'react';
import { X, Package, ShoppingBag, User, Calendar, MapPin, CreditCard } from 'lucide-react';
import api from '../api';

const OrderDetailsModal = ({ order, onClose }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (order) {
            fetchOrderItems();
        }
    }, [order]);

    const fetchOrderItems = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/orders/${order.order_id}`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching order items:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!order) return null;

    return (
        <div className="card shadow-lg border-0 overflow-hidden">
            <div className="card-header bg-white d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                    <ShoppingBag className="text-primary" size={20} />
                    <h5 className="mb-0 fw-bold text-dark">Order Request #{order.order_id}</h5>
                </div>
                <button onClick={onClose} className="btn btn-link text-secondary p-0 text-decoration-none">
                    <X size={24} />
                </button>
            </div>

            <div className="card-body p-0">
                {/* Order Meta Info */}
                <div className="bg-light p-4 border-bottom">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="d-flex align-items-start gap-2">
                                <User size={18} className="text-secondary mt-1" />
                                <div>
                                    <label className="small text-uppercase text-secondary fw-bold d-block mb-1">Customer</label>
                                    <div className="fw-medium text-dark">{order.customer_name || 'Guest User'}</div>
                                    <div className="small text-muted">{order.customer_email}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-start gap-2">
                                <Calendar size={18} className="text-secondary mt-1" />
                                <div>
                                    <label className="small text-uppercase text-secondary fw-bold d-block mb-1">Date Placed</label>
                                    <div className="fw-medium text-dark">{new Date(order.order_date).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-start gap-2">
                                <Package size={18} className="text-secondary mt-1" />
                                <div>
                                    <label className="small text-uppercase text-secondary fw-bold d-block mb-1">Status</label>
                                    <span className="badge bg-primary-subtle text-primary-emphasis px-2 py-1">
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="p-4">
                    <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                        Order Items
                        <span className="badge bg-secondary rounded-pill small f-8">{items.length}</span>
                    </h6>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            <span className="ms-2 text-muted">Loading items...</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="bg-light-subtle">
                                    <tr>
                                        <th className="small text-uppercase text-secondary fw-bold border-0">Product</th>
                                        <th className="small text-uppercase text-secondary fw-bold border-0 text-center">Qty</th>
                                        <th className="small text-uppercase text-secondary fw-bold border-0 text-end">Price</th>
                                        <th className="small text-uppercase text-secondary fw-bold border-0 text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.order_item_id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.product_name} width="40" height="40" className="rounded border object-fit-cover" />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center border" style={{ width: 40, height: 40 }}>
                                                            <ShoppingBag size={16} className="text-secondary" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="fw-medium text-dark">{item.product_name}</div>
                                                        <div className="small text-muted">{item.weight_quantity} {item.weight_unit}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center fw-medium text-dark">{item.quantity}</td>
                                            <td className="text-end text-muted">${Number(item.price).toFixed(2)}</td>
                                            <td className="text-end fw-bold text-dark">${(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="table-light">
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold text-dark p-3">Total Amount</td>
                                        <td className="text-end fw-bold text-primary p-3 fs-5">${Number(order.total_amount).toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>

                {/* Payment Details */}
                {order.payment_details && (
                    <div className="p-4 border-top">
                        <div className="bg-light-subtle p-3 rounded border">
                            <h6 className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                                <CreditCard size={18} className="text-primary" />
                                Payment Details
                            </h6>
                            <div className="text-secondary small">
                                {typeof order.payment_details === 'string'
                                    ? order.payment_details
                                    : JSON.stringify(order.payment_details)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="card-footer bg-white p-3 d-flex justify-content-end gap-2 border-top">
                <button onClick={onClose} className="btn btn-primary px-4">Close Details</button>
            </div>
        </div>
    );
};

export default OrderDetailsModal;

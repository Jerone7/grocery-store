import React from 'react';
import { Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const OrderTable = ({ orders, onViewDetails }) => {
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { color: 'bg-warning-subtle text-warning-emphasis', icon: <Clock size={14} /> },
            'completed': { color: 'bg-success-subtle text-success-emphasis', icon: <CheckCircle size={14} /> },
            'shipped': { color: 'bg-primary-subtle text-primary-emphasis', icon: <Truck size={14} /> },
            'cancelled': { color: 'bg-danger-subtle text-danger-emphasis', icon: <XCircle size={14} /> },
        };

        const config = statusMap[status.toLowerCase()] || { color: 'bg-secondary-subtle text-secondary', icon: null };

        return (
            <span className={`badge ${config.color} d-inline-flex align-items-center gap-1 fw-medium px-2 py-1`}>
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="card shadow-sm border-0 overflow-hidden">
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Order ID</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Customer</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Date</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Total</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Status</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-5 text-center text-muted">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.order_id}>
                                    <td className="px-4 py-3 align-middle fw-semibold text-primary">
                                        #{order.order_id}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="fw-medium text-dark">{order.customer_name || 'Guest'}</div>
                                        <div className="small text-secondary">{order.customer_email}</div>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-muted">
                                        {new Date(order.order_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 align-middle fw-bold text-dark">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-4 py-3 align-middle text-end">
                                        <button
                                            onClick={() => onViewDetails(order)}
                                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                                        >
                                            <Eye size={16} /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const isProductEnabled = (value) => {
    if (value === true || value === 1 || value === '1' || value === 'true') {
        return true;
    }

    if (value && typeof value === 'object' && Array.isArray(value.data)) {
        return value.data[0] === 1;
    }

    return false;
};

const ProductTable = ({ products, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="card shadow overflow-hidden border-0">
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Image</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Name</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Price</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Stock</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary">Status</th>
                            <th className="px-4 py-3 small text-uppercase text-secondary text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-5 text-center text-muted">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-4 py-3 align-middle">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="rounded-circle border object-fit-cover"
                                                style={{ width: '40px', height: '40px' }}
                                            />
                                        ) : (
                                            <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center text-secondary small" style={{ width: '40px', height: '40px' }}>
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="fw-medium text-dark">{product.name}</div>
                                        {product.weight_quantity && (
                                            <div className="small text-secondary">{product.weight_quantity} {product.weight_unit}</div>
                                        )}
                                        <div className="text-muted text-truncate" style={{ maxWidth: '200px' }}>{product.description}</div>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-muted">
                                        ${Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 align-middle text-muted">
                                        {product.stock_quantity}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="form-check form-switch d-inline-block m-0">
                                            <input
                                                className="form-check-input product-status-toggle m-0"
                                                type="checkbox"
                                                role="switch"
                                                checked={isProductEnabled(product.is_enabled)}
                                                onChange={() => onToggleStatus(product)}
                                                aria-label={`Toggle product status for ${product.name}`}
                                                title={isProductEnabled(product.is_enabled) ? 'Enabled' : 'Disabled'}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-end">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="btn btn-link text-primary p-0 me-3 text-decoration-none d-inline-flex align-items-center gap-1"
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(product.id)}
                                            className="btn btn-link text-danger p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                                        >
                                            <Trash2 size={16} /> Delete
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

export default ProductTable;

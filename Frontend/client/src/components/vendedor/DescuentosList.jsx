import { useState, useEffect } from 'react';
// Redux imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchVendedorProductos, selectVendedorProductos, selectVendedorLoading } from '../../redux/slices/vendedorSlice';
import {
    fetchDescuentoByProducto,
    createNewDescuento,
    deleteExistingDescuento,
    selectDescuentosCreating,
    selectDescuentosError,
} from '../../redux/slices/descuentosSlice';
import Toast from '../common/Toast';
import '../../styles/descuentosList.css';

export default function DescuentosList() {
    const dispatch = useAppDispatch();

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const productos = useAppSelector(selectVendedorProductos);
    const loading = useAppSelector(selectVendedorLoading);
    const creating = useAppSelector(selectDescuentosCreating);
    const error = useAppSelector(selectDescuentosError);

    const [selectedProducto, setSelectedProducto] = useState(null);
    const [descuentoCompleto, setDescuentoCompleto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({
        message: "",
        type: "success"
    });
    const [formData, setFormData] = useState({
        porcentajeDescuento: '',
        fechaInicio: '',
        fechaFin: '',
        activo: true,
        descripcion: ''
    });

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchVendedorProductos({ page: 0, size: 50 }));
        }
    }, [user?.token, dispatch]);

    // Mostrar errores con toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    const handleProductoClick = async (producto) => {
        setSelectedProducto(producto);

        if (producto.tieneDescuento) {
            const result = await dispatch(fetchDescuentoByProducto(producto.id));
            if (result.type === 'descuentos/fetchDescuentoByProducto/fulfilled') {
                setDescuentoCompleto(result.payload.descuento);
                setShowModal(true);
            }
        } else {
            setDescuentoCompleto(null);
            resetForm();
            setShowModal(true);
        }
    }; const resetForm = () => {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);

        setFormData({
            porcentajeDescuento: '',
            fechaInicio: now.toISOString().slice(0, 16),
            fechaFin: futureDate.toISOString().slice(0, 16),
            activo: true,
            descripcion: ''
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProducto(null);
        setDescuentoCompleto(null);
        resetForm();
    };

    const handleCreateDescuento = async (e) => {
        e.preventDefault();

        if (!selectedProducto) return;

        const descuentoData = {
            porcentajeDescuento: parseFloat(formData.porcentajeDescuento),
            fechaInicio: new Date(formData.fechaInicio).toISOString(),
            fechaFin: new Date(formData.fechaFin).toISOString(),
            activo: formData.activo,
            descripcion: formData.descripcion || 'Descuento especial'
        };

        const result = await dispatch(createNewDescuento({
            productoId: selectedProducto.id,
            descuentoData
        }));

        if (result.type === 'descuentos/createNewDescuento/fulfilled') {
            setToastConfig({ message: "✓ Descuento creado exitosamente", type: "success" });
            setShowToast(true);
            dispatch(fetchVendedorProductos({ page: 0, size: 50 }));
            handleCloseModal();
        } else if (result.type === 'descuentos/createNewDescuento/rejected') {
            setToastConfig({ message: result.payload || "Error al crear descuento", type: "error" });
            setShowToast(true);
        }
    };

    const handleDeleteDescuento = async () => {
        if (!descuentoCompleto) return;
        if (!window.confirm('¿Estás seguro de eliminar este descuento?')) return;

        const result = await dispatch(deleteExistingDescuento({
            productoId: selectedProducto.id,
            descuentoId: descuentoCompleto.id
        }));

        if (result.type === 'descuentos/deleteExistingDescuento/fulfilled') {
            setToastConfig({ message: "✓ Descuento eliminado exitosamente", type: "success" });
            setShowToast(true);
            // Refrescar productos para actualizar el estado de descuentos
            dispatch(fetchVendedorProductos({ page: 0, size: 50 }));
            handleCloseModal();
        } else if (result.type === 'descuentos/deleteExistingDescuento/rejected') {
            setToastConfig({ message: result.payload || "Error al eliminar descuento", type: "error" });
            setShowToast(true);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calcularPrecioConDescuento = (precio, porcentaje) => {
        return precio * (1 - porcentaje / 100);
    };

    // Obtener el porcentaje de descuento del producto
    const getPorcentajeDescuento = (producto) => {
        return producto.porcentajeDescuento || 0;
    };

    // Obtener el precio con descuento del producto
    const getPrecioConDescuento = (producto) => {
        return producto.precioConDescuento || producto.precio;
    };

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div className="descuentos-container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="descuentos-header">
                <div className="descuentos-title">
                    <h2>Gestión de Descuentos</h2>
                    <p>Haz clic en un producto para crear o eliminar un descuento</p>
                </div>
                {/* Debug info */}
                {productos.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                        Total productos: {productos.length} |
                        Con descuento: {productos.filter(p => p.tieneDescuento).length}
                    </div>
                )}
            </div>

            {productos.length === 0 ? (
                <div className="empty-state">
                    <h3>No tienes productos creados</h3>
                    <p>Primero crea productos para poder aplicar descuentos</p>
                </div>
            ) : (
                <div className="descuentos-grid">
                    {productos.map(producto => {
                        return (
                            <div
                                key={producto.id}
                                className={`descuento-card ${producto.tieneDescuento ? 'has-discount' : ''}`}
                                onClick={() => handleProductoClick(producto)}
                            >
                                {producto.tieneDescuento && (
                                    <div className="discount-badge">
                                        -{getPorcentajeDescuento(producto)}%
                                    </div>
                                )}

                                <div className="descuento-image">
                                    {(() => {
                                        const imagenPrincipal = producto.imagenUrl ||
                                            (producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].url : null);

                                        return imagenPrincipal ? (
                                            <img
                                                src={imagenPrincipal}
                                                alt={producto.titulo}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null;
                                    })()}
                                    <div className="descuento-image-placeholder" style={{
                                        display: (producto.imagenUrl || (producto.imagenes && producto.imagenes.length > 0)) ? 'none' : 'flex'
                                    }}>
                                        📦
                                    </div>
                                </div>

                                <div className="descuento-info">
                                    <h3 className="descuento-title">{producto.titulo}</h3>

                                    <div className="descuento-prices">
                                        {producto.tieneDescuento ? (
                                            <>
                                                <div className="price-original">
                                                    {formatPrice(producto.precio)}
                                                </div>
                                                <div className="price-discount">
                                                    {formatPrice(getPrecioConDescuento(producto))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="price-normal">
                                                {formatPrice(producto.precio)}
                                            </div>
                                        )}
                                    </div>

                                    {producto.tieneDescuento && (
                                        <div className="descuento-details">
                                            <div className="descuento-status">
                                                <span className="status-indicator active">
                                                    Activo
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="descuento-action-hint">
                                        {producto.tieneDescuento ? (
                                            <span className="hint-text">Click para eliminar descuento</span>
                                        ) : (
                                            <span className="hint-text">Click para agregar descuento</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && selectedProducto && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {descuentoCompleto ? 'Eliminar Descuento' : 'Crear Descuento'}
                            </h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-producto-info">
                                <h3>{selectedProducto.titulo}</h3>
                                <p>Precio actual: {formatPrice(selectedProducto.precio)}</p>
                            </div>

                            {descuentoCompleto ? (
                                <div className="descuento-info-detail">
                                    <p><strong>Descuento actual:</strong> {descuentoCompleto.porcentajeDescuento}%</p>
                                    <p><strong>Precio con descuento:</strong> {formatPrice(getPrecioConDescuento(selectedProducto))}</p>
                                    <p><strong>Válido desde:</strong> {formatDate(descuentoCompleto.fechaInicio)}</p>
                                    <p><strong>Válido hasta:</strong> {formatDate(descuentoCompleto.fechaFin)}</p>
                                    <p><strong>Estado:</strong> {descuentoCompleto.activo ? 'Activo' : 'Inactivo'}</p>
                                    {descuentoCompleto.descripcion && (
                                        <p><strong>Descripción:</strong> {descuentoCompleto.descripcion}</p>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleCreateDescuento} className="descuento-form">
                                    <div className="form-group">
                                        <label htmlFor="porcentaje">Porcentaje de descuento (%)</label>
                                        <input
                                            id="porcentaje"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={formData.porcentajeDescuento}
                                            onChange={(e) => setFormData({ ...formData, porcentajeDescuento: e.target.value })}
                                            required
                                        />
                                        {formData.porcentajeDescuento && (
                                            <small className="preview-price">
                                                Precio con descuento: {formatPrice(
                                                    calcularPrecioConDescuento(
                                                        selectedProducto.precio,
                                                        parseFloat(formData.porcentajeDescuento)
                                                    )
                                                )}
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="fechaInicio">Fecha de inicio</label>
                                        <input
                                            id="fechaInicio"
                                            type="datetime-local"
                                            value={formData.fechaInicio}
                                            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="fechaFin">Fecha de fin</label>
                                        <input
                                            id="fechaFin"
                                            type="datetime-local"
                                            value={formData.fechaFin}
                                            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="descripcion">Descripción (opcional)</label>
                                        <input
                                            id="descripcion"
                                            type="text"
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                            placeholder="Ej: Descuento de temporada"
                                        />
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                            />
                                            <span>Activar descuento inmediatamente</span>
                                        </label>
                                    </div>

                                    <div className="modal-actions">
                                        <button type="button" onClick={handleCloseModal} className="btn-secondary">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Crear Descuento
                                        </button>
                                    </div>
                                </form>
                            )}

                            {descuentoCompleto && (
                                <div className="modal-actions">
                                    <button onClick={handleCloseModal} className="btn-secondary">
                                        Cancelar
                                    </button>
                                    <button onClick={handleDeleteDescuento} className="btn-danger">
                                        Eliminar Descuento
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

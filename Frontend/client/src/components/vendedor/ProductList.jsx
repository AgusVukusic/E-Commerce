import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Redux imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/authSlice';
import {
    fetchVendedorProductos,
    deleteVendedorProducto,
    selectVendedorProductos,
    selectVendedorLoading,
    selectVendedorError,
} from '../../redux/slices/vendedorSlice';
import { fetchUsuarioById } from '../../redux/slices/usuariosSlice';
import Toast from '../common/Toast';
import '../../styles/productList.css';

export default function ProductList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const productos = useAppSelector(selectVendedorProductos);
    const loading = useAppSelector(selectVendedorLoading);
    const error = useAppSelector(selectVendedorError);

    const [vendedores, setVendedores] = useState({}); // Cache de vendedores {id: {nombre, apellido}}
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({
        message: "",
        type: "success"
    });

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchVendedorProductos({ page: 0, size: 50 }));
        }
    }, [user?.token, dispatch]);

    // Cargar vendedores si es admin
    useEffect(() => {
        if (user?.rol === "ADMIN" && productos.length > 0) {
            loadVendedores(productos);
        }
    }, [productos, user?.rol]);

    // Mostrar errores con toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);


    const loadVendedores = async (productosArray) => {
        try {
            // Obtener IDs únicos de vendedores
            const vendedorIds = [...new Set(productosArray.map(p => p.vendedorId).filter(Boolean))];

            // Cargar información de cada vendedor usando Redux
            const vendedoresData = {};
            await Promise.all(
                vendedorIds.map(async (vendedorId) => {
                    try {
                        const result = await dispatch(fetchUsuarioById(vendedorId));
                        if (result.type === 'usuarios/fetchUsuarioById/fulfilled') {
                            const vendedor = result.payload;
                            vendedoresData[vendedorId] = {
                                nombre: vendedor.nombre,
                                apellido: vendedor.apellido
                            };
                        } else {
                            vendedoresData[vendedorId] = {
                                nombre: 'Vendedor',
                                apellido: `#${vendedorId}`
                            };
                        }
                    } catch (error) {
                        console.error(`Error al cargar vendedor ${vendedorId}:`, error);
                        vendedoresData[vendedorId] = {
                            nombre: 'Vendedor',
                            apellido: `#${vendedorId}`
                        };
                    }
                })
            );

            setVendedores(vendedoresData);
        } catch (error) {
            console.error('Error al cargar vendedores:', error);
        }
    };

    const handleEdit = (productoId) => {
        // Determinar la ruta según el rol del usuario
        const editPath = user?.rol === "ADMIN"
            ? `/admin/producto/editar/${productoId}`
            : `/dashboard/producto/editar/${productoId}`;
        navigate(editPath);
    };

    const handleDelete = async (productoId) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        const result = await dispatch(deleteVendedorProducto(productoId));

        // Si se eliminó exitosamente, refrescar la lista
        if (result.type === 'vendedor/deleteVendedorProducto/fulfilled') {
            setToastConfig({ message: "✓ Producto eliminado exitosamente", type: "success" });
            setShowToast(true);
            dispatch(fetchVendedorProductos({ page: 0, size: 50 }));
        } else if (result.type === 'vendedor/deleteVendedorProducto/rejected') {
            setToastConfig({ message: result.payload || "Error al eliminar producto", type: "error" });
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

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div className="product-list-container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            {productos.length === 0 ? (
                <div className="empty-state">
                    <h3>No tienes productos creados</h3>
                    <p>Crea tu primer producto para comenzar a vender</p>
                </div>
            ) : (
                <div className="products-grid">
                    {productos.map(producto => (
                        <div key={producto.id} className="product-card" onClick={() => handleEdit(producto.id)}>
                            <div className="product-image">
                                {(() => {
                                    // Buscar imagen principal: puede estar en imagenUrl o ser la primera del array
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
                                <div className="product-image-placeholder" style={{
                                    display: (producto.imagenUrl || (producto.imagenes && producto.imagenes.length > 0)) ? 'none' : 'flex'
                                }}>
                                    📦
                                </div>
                            </div>

                            <div className="product-info">
                                <h3 className="product-title">{producto.titulo}</h3>
                                <p className="product-description">
                                    {producto.descripcion?.length > 80
                                        ? `${producto.descripcion.substring(0, 80)}...`
                                        : producto.descripcion
                                    }
                                </p>

                                <div className="product-details">
                                    <div className="product-price">
                                        {formatPrice(producto.precio)}
                                    </div>
                                    <div className="product-stock">
                                        Stock: {producto.stock || 0}
                                    </div>
                                    <div className="product-category">
                                        {producto.categoriaNombre}
                                    </div>
                                </div>

                                {/* Mostrar vendedor solo si es ADMIN */}
                                {user?.rol === "ADMIN" && producto.vendedorId && vendedores[producto.vendedorId] && (
                                    <div className="product-vendor">
                                        <span className="vendor-badge">
                                            Vendedor: {vendedores[producto.vendedorId].nombre} {vendedores[producto.vendedorId].apellido}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => handleEdit(producto.id)}
                                    className="btn-edit"
                                    title="Editar producto"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(producto.id)}
                                    className="btn-delete"
                                    title="Eliminar producto"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
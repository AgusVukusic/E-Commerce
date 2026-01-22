import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Redux imports
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import {
    fetchVendedorProducto,
    createVendedorProducto,
    updateVendedorProducto,
    addImagenProducto,
    deleteImagenProducto,
    selectCurrentVendedorProducto,
    selectVendedorLoading,
    selectVendedorError,
    selectVendedorActionSuccess,
    clearActionSuccess as clearVendedorActionSuccess,
    clearCurrentProducto,
} from '../redux/slices/vendedorSlice';
import {
    fetchCategorias,
    selectCategorias,
    selectCategoriasLoading,
} from '../redux/slices/categoriasSlice';
import Toast from '../components/common/Toast';
import '../styles/productForm.css';

export default function ProductForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: "", type: "success" });

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const currentProducto = useAppSelector(selectCurrentVendedorProducto);
    const categorias = useAppSelector(selectCategorias);
    const loading = useAppSelector(selectVendedorLoading);
    const error = useAppSelector(selectVendedorError);
    const actionSuccess = useAppSelector(selectVendedorActionSuccess);

    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoriaId: '',
        imagenUrl: '', // URL principal
        imagenes: [] // URLs adicionales
    });

    const [imageUrls, setImageUrls] = useState(['']); // Array para manejar múltiples URLs
    const [originalImageUrls, setOriginalImageUrls] = useState([]); // Para rastrear imágenes originales

    useEffect(() => {
        dispatch(fetchCategorias());

        if (isEdit && user?.token) {
            dispatch(fetchVendedorProducto(id));
        }

        return () => {
            dispatch(clearCurrentProducto());
        };
    }, [id, user?.token, isEdit, dispatch]);

    // Mostrar errores con Toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    // Mostrar éxito con Toast
    useEffect(() => {
        if (actionSuccess) {
            setToastConfig({ message: actionSuccess, type: "success" });
            setShowToast(true);
            const timer = setTimeout(() => {
                dispatch(clearVendedorActionSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [actionSuccess, dispatch]);

    // Actualizar formData cuando se cargue el producto
    useEffect(() => {
        if (currentProducto && isEdit) {
            setFormData({
                titulo: currentProducto.titulo || '',
                descripcion: currentProducto.descripcion || '',
                precio: currentProducto.precio?.toString() || '',
                stock: currentProducto.stock?.toString() || '',
                categoriaId: currentProducto.categoriaId?.toString() || '',
                imagenUrl: currentProducto.imagenUrl || '',
                imagenes: currentProducto.imagenes || []
            });

            // Cargar URLs de imágenes: principal primero, luego adicionales
            const urls = [];

            // Agregar imagen principal si existe
            if (currentProducto.imagenUrl) {
                urls.push(currentProducto.imagenUrl);
            }

            // Agregar imágenes adicionales (filtrar la principal si está duplicada)
            if (currentProducto.imagenes && currentProducto.imagenes.length > 0) {
                currentProducto.imagenes.forEach(img => {
                    if (img.url && img.url !== currentProducto.imagenUrl) {
                        urls.push(img.url);
                    }
                });
            }

            // Asegurar que siempre haya al menos un campo
            if (urls.length === 0) urls.push('');

            setImageUrls(urls);
            setOriginalImageUrls([...urls]); // Guardar copia de las imágenes originales
        }
    }, [currentProducto, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrlField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeImageUrlField = async (index) => {
        if (imageUrls.length > 1) {
            const urlToRemove = imageUrls[index];

            // Si estamos en modo edición y la imagen existía originalmente, eliminarla del servidor
            if (isEdit && urlToRemove && originalImageUrls.includes(urlToRemove)) {
                const imagen = formData.imagenes.find(img => img.url === urlToRemove);
                if (imagen && imagen.id) {
                    const result = await dispatch(deleteImagenProducto({
                        productoId: id,
                        imagenId: imagen.id
                    }));

                    if (result.type !== 'vendedor/deleteImagenProducto/fulfilled') {
                        return; // No eliminar del array local si falló
                    }
                }
            }

            const newUrls = imageUrls.filter((_, i) => i !== index);
            setImageUrls(newUrls);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim() || !formData.precio || !formData.categoriaId) {
            return;
        }

        const productData = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock) || 0,
            categoriaId: parseInt(formData.categoriaId),
            imagenUrl: imageUrls[0] || ''
        };

        let result;
        if (isEdit) {
            result = await dispatch(updateVendedorProducto({ id, producto: productData }));
        } else {
            result = await dispatch(createVendedorProducto(productData));
        }

        if (result.type.includes('/fulfilled')) {
            const producto = result.payload;

            // Manejar imágenes adicionales
            if (producto.id && imageUrls.length > 1) {
                for (let i = 1; i < imageUrls.length; i++) {
                    const url = imageUrls[i].trim();
                    if (url && (!isEdit || !originalImageUrls.includes(url))) {
                        await dispatch(addImagenProducto({ productoId: producto.id, url }));
                    }
                }
            }

            // Redirigir después de un breve delay
            setTimeout(() => {
                const redirectPath = user?.rol === "ADMIN" ? '/admin' : '/dashboard';
                navigate(redirectPath);
            }, 1500);
        }
    };

    const handleCancel = () => {
        const redirectPath = user?.rol === "ADMIN" ? '/admin' : '/dashboard';
        navigate(redirectPath);
    };

    if (loading && isEdit) {
        return <div className="loading">Cargando producto...</div>;
    }

    return (
        <div className="product-form-container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="product-form-header">
                <h1>{isEdit ? 'Editar Producto' : 'Crear Producto'}</h1>
                <p>Complete los datos del producto</p>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="titulo">Título *</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                        placeholder="Nombre del producto"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Descripción del producto"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="precio">Precio *</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="categoriaId">Categoría *</label>
                    <select
                        id="categoriaId"
                        name="categoriaId"
                        value={formData.categoriaId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Imágenes del Producto</label>
                    <div className="image-urls-container">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="image-url-row">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                    placeholder={index === 0 ? "URL de imagen principal" : "URL de imagen adicional"}
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageUrlField(index)}
                                        className="btn-remove-image"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageUrlField}
                            className="btn-add-image"
                        >
                            + Añadir otra imagen
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </div>
    );
}
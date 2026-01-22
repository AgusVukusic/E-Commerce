import { useState, useEffect } from 'react';
// Redux imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/authSlice';
import {
    fetchCategorias,
    createNewCategoria,
    deleteExistingCategoria,
    selectCategorias,
    selectCategoriasLoading,
    selectCategoriasCreating,
    selectCategoriasError,
} from '../../redux/slices/categoriasSlice';
import Toast from '../common/Toast';
import '../../styles/categoriasList.css';

export default function CategoriasList() {
    const dispatch = useAppDispatch();

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const categorias = useAppSelector(selectCategorias);
    const loading = useAppSelector(selectCategoriasLoading);
    const creating = useAppSelector(selectCategoriasCreating);
    const error = useAppSelector(selectCategoriasError);

    const [showForm, setShowForm] = useState(false);
    const [newCategoriaNombre, setNewCategoriaNombre] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({
        message: "",
        type: "success"
    });

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchCategorias());
        }
    }, [user?.token, dispatch]);

    // Mostrar errores con toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    const handleCreateCategoria = async (e) => {
        e.preventDefault();

        if (!newCategoriaNombre.trim()) {
            return;
        }

        const result = await dispatch(createNewCategoria({
            nombre: newCategoriaNombre.trim()
        }));

        if (result.type === 'categorias/createNewCategoria/fulfilled') {
            setNewCategoriaNombre('');
            setShowForm(false);
            setToastConfig({ message: "✓ Categoría creada exitosamente", type: "success" });
            setShowToast(true);
        } else if (result.type === 'categorias/createNewCategoria/rejected') {
            setToastConfig({ message: result.payload || "Error al crear categoría", type: "error" });
            setShowToast(true);
        }
    };

    const handleCancelCreate = () => {
        setShowForm(false);
        setNewCategoriaNombre('');
    };

    const handleDelete = async (categoriaId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

        const result = await dispatch(deleteExistingCategoria(categoriaId));

        // Si se eliminó exitosamente, refrescar la lista
        if (result.type === 'categorias/deleteExistingCategoria/fulfilled') {
            setToastConfig({ message: "✓ Categoría eliminada exitosamente", type: "success" });
            setShowToast(true);
            dispatch(fetchCategorias());
        } else if (result.type === 'categorias/deleteExistingCategoria/rejected') {
            setToastConfig({ message: result.payload || "Error al eliminar categoría", type: "error" });
            setShowToast(true);
        }
    };

    if (loading) {
        return <div className="loading">Cargando categorías...</div>;
    }

    return (
        <div className="categorias-container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="categorias-header">
                <div className="categorias-title">
                    <h2>Categorías</h2>
                    <p>Gestiona las categorías de tus productos</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        Nueva categoría
                    </button>
                )}
            </div>

            {showForm && (
                <div className="categoria-form-container">
                    <form onSubmit={handleCreateCategoria} className="categoria-form">
                        <div className="form-group">
                            <label htmlFor="nombreCategoria">Nombre de la categoría</label>
                            <input
                                type="text"
                                id="nombreCategoria"
                                value={newCategoriaNombre}
                                onChange={(e) => setNewCategoriaNombre(e.target.value)}
                                placeholder="Ej: Juegos de Acción"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleCancelCreate}
                                className="btn-cancel"
                                disabled={creating}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={creating}
                            >
                                {creating ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {categorias.length === 0 ? (
                <div className="empty-state">
                    <h3>No hay categorías creadas</h3>
                    <p>Crea tu primera categoría para organizar tus productos</p>
                </div>
            ) : (
                <div className="categorias-list">
                    {categorias.map(categoria => (
                        <div key={categoria.id} className="categoria-card">
                            <div className="categoria-info">
                                <h3 className="categoria-nombre">{categoria.nombre}</h3>
                            </div>
                            <button
                                onClick={() => handleDelete(categoria.id)}
                                className="categoria-delete-btn"
                                title="Eliminar categoría"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
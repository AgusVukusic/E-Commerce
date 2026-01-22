import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Redux imports
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import { performCheckout, fetchCart, selectCheckingOut } from '../redux/slices/cartSlice';
import { getUserId } from '../utils/userUtils';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import '../styles/checkout.css';

const Checkout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const isProcessing = useAppSelector(selectCheckingOut);
    
    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        name: '',
        dni: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Formatear número de tarjeta (solo números, máximo 16 dígitos)
        if (name === 'cardNumber') {
            newValue = value.replace(/\D/g, '').slice(0, 16);
        }

        // Formatear CVV (solo números, máximo 3 dígitos)
        if (name === 'cvv') {
            newValue = value.replace(/\D/g, '').slice(0, 3);
        }

        // Formatear DNI (solo números, máximo 8 dígitos)
        if (name === 'dni') {
            newValue = value.replace(/\D/g, '').slice(0, 8);
        }

        setFormData({
            ...formData,
            [name]: newValue
        });

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar número de tarjeta (debe tener 16 dígitos)
        if (formData.cardNumber.length !== 16) {
            newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
        }

        // Validar CVV (debe tener 3 dígitos)
        if (formData.cvv.length !== 3) {
            newErrors.cvv = 'El CVV debe tener 3 dígitos';
        }

        // Validar DNI (debe tener 7 u 8 dígitos)
        if (formData.dni.length < 7 || formData.dni.length > 8) {
            newErrors.dni = 'El DNI debe tener 7 u 8 dígitos';
        }

        // Validar mes de vencimiento
        if (!formData.expiryMonth) {
            newErrors.expiryMonth = 'Seleccione el mes de vencimiento';
        }

        // Validar año de vencimiento
        if (!formData.expiryYear) {
            newErrors.expiryYear = 'Seleccione el año de vencimiento';
        }

        // Validar que la tarjeta no esté vencida
        if (formData.expiryMonth && formData.expiryYear) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11

            const expiryYear = parseInt(formData.expiryYear);
            const expiryMonth = parseInt(formData.expiryMonth);

            if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                newErrors.expiry = 'La tarjeta está vencida';
            }
        }

        // Validar nombre
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        // Validar el formulario
        if (!validateForm()) {
            return;
        }

        // Dispatch del thunk de Redux
        const result = await dispatch(performCheckout());

        if (result.type === 'cart/performCheckout/fulfilled') {
            // Refrescar el carrito para actualizar el count a 0
            setTimeout(() => {
                dispatch(fetchCart());
            }, 300);

            // Redirigir a la página de éxito
            navigate('/payment-success');
        } else if (result.payload) {
            alert('Hubo un error al procesar el pago. Por favor intenta nuevamente.');
        }
    };

    const handleCancel = () => {
        navigate('/cart');
    };

    // Generar opciones de mes (01-12)
    const months = Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, '0');
        return { value: month, label: month };
    });

    // Generar opciones de año (año actual hasta 10 años adelante)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => {
        const year = currentYear + i;
        return { value: String(year), label: String(year) };
    });

    return (
        <div className="checkout-container">
            <div className="checkout-form-container">
                <h2>Información de pago</h2>
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-group">
                        <label htmlFor="cardNumber">Número de tarjeta</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                            className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiryMonth">Vencimiento</label>
                            <div className="expiry-inputs">
                                <select
                                    id="expiryMonth"
                                    name="expiryMonth"
                                    value={formData.expiryMonth}
                                    onChange={handleChange}
                                    required
                                    className={errors.expiryMonth || errors.expiry ? 'error' : ''}
                                >
                                    <option value="">Mes</option>
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    id="expiryYear"
                                    name="expiryYear"
                                    value={formData.expiryYear}
                                    onChange={handleChange}
                                    required
                                    className={errors.expiryYear || errors.expiry ? 'error' : ''}
                                >
                                    <option value="">Año</option>
                                    {years.map(year => (
                                        <option key={year.value} value={year.value}>
                                            {year.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(errors.expiryMonth || errors.expiryYear || errors.expiry) && (
                                <span className="error-message">
                                    {errors.expiry || errors.expiryMonth || errors.expiryYear}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleChange}
                                required
                                className={errors.cvv ? 'error' : ''}
                            />
                            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Nombre en la tarjeta</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="NOMBRE APELLIDO"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dni">DNI</label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            placeholder="12345678"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                            className={errors.dni ? 'error' : ''}
                        />
                        {errors.dni && <span className="error-message">{errors.dni}</span>}
                    </div>

                    <div className="checkout-buttons">
                        <button
                            type="submit"
                            className="pay-button"
                            disabled={isProcessing}
                        >
                            <LockClosedIcon className="lock-icon" />
                            {isProcessing ? 'Procesando...' : 'Pagar'}
                        </button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
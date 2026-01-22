import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Redux imports
import { useAppDispatch } from '../redux/hooks';
import { fetchCart } from '../redux/slices/cartSlice';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import '../styles/checkout.css';

const PaymentSuccess = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Refrescar el contador del carrito al montar el componente
        dispatch(fetchCart());

        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, dispatch]);

    return (
        <div className="success-container">
            <div className="success-content">
                <CheckCircleIcon className="success-icon" />
                <h2>¡Compra realizada con éxito!</h2>
            </div>
        </div>
    );
};

export default PaymentSuccess;
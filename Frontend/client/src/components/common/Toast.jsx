import { useEffect } from "react";
import "../../styles/toast.css";

/**
 * Toast notification component
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success' | 'error' | 'info' | 'warning'
 * @param {number} duration - Duración en ms (default: 3000)
 * @param {function} onClose - Callback cuando se cierre
 */
export default function Toast({ message, type = "success", duration = 3000, onClose }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✓";
            case "error":
                return "✕";
            case "warning":
                return "⚠";
            case "info":
                return "ℹ";
            default:
                return "✓";
        }
    };

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__icon">{getIcon()}</div>
            <div className="toast__message">{message}</div>
            {onClose && (
                <button className="toast__close" onClick={onClose} aria-label="Cerrar">
                    ✕
                </button>
            )}
        </div>
    );
}

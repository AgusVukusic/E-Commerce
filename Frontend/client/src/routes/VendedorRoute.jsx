import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

export default function VendedorRoute({ children }) {
    const user = useAppSelector(selectUser);
    const location = useLocation();

    if (!user) {
        const back = location.pathname + location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(back)}`} replace />;
    }

    if (user.rol !== "VENDEDOR") {
        return <Navigate to="/" replace />;
    }

    return children;
}

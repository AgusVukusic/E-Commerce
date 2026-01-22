import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

export default function UserRoute({ children }) {
    const user = useAppSelector(selectUser);

    if (!user) {
        return children;
    }

    if (user.rol === "VENDEDOR") {
        return <Navigate to="/dashboard" replace />;
    }

    if (user.rol === "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
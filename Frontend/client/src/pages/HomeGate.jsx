import { Navigate } from "react-router-dom";
// Redux imports
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import Home from "./Home";

export default function HomeGate() {
    const user = useAppSelector(selectUser);

    if (user?.rol === "VENDEDOR") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Home />;
}

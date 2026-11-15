import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../context/useAuthContext";
import { RoutePaths } from "../routes/RoutePaths";

export default function ManagerLayout() {
    const { isManager } = useAuthContext();

    if (!isManager) {
        return <Navigate to={RoutePaths.DASHBOARD} />;
    }

    return <Outlet />;
}

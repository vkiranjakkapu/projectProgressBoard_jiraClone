import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../context/useAuthContext";
import { RoutePaths } from "../routes/RoutePaths";

export default function NonUsersLayout() {
    const { isUser } = useAuthContext();

    if (isUser) {
        return <Navigate to={RoutePaths.DASHBOARD} />;
    }

    return <Outlet />;
}

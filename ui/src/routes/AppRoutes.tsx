import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LandingPage from "../pages/landing/LandingPage";
import ProfilePage from "../pages/profile/ProfilePage";
import { RoutePaths } from "./RoutePaths";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path={RoutePaths.LANDING} element={<LandingPage />} />
            </Route>
            <Route element={<ProtectedLayout />}>
                <Route
                    path={RoutePaths.DASHBOARD}
                    element={<DashboardPage />}
                />
                <Route path={RoutePaths.PROFILE} element={<ProfilePage />} />

                <Route element={<AdminLayout />}></Route>
                <Route element={<ManagerLayout />}></Route>
            </Route>
        </Routes>
    );
}

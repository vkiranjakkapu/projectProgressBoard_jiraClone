import { Route, Routes } from "react-router-dom";
import ManagerLayout from "../layouts/ManagerLayout";
import NonAdminLayout from "../layouts/NonAdminLayout";
import NonUsersLayout from "../layouts/NonUsersLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LandingPage from "../pages/landing/LandingPage";
import MyTasksPage from "../pages/mytasks/MyTasksPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import SprintPlanningPage from "../pages/sprint/SprintPlanningPage";
import UsersPage from "../pages/users/UsersPage";
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

                <Route element={<NonAdminLayout />}>
                    <Route
                        path={RoutePaths.MYTASKS}
                        element={<MyTasksPage />}
                    />
                </Route>

                <Route element={<ManagerLayout />}>
                    <Route
                        path={RoutePaths.PROJECTS}
                        element={<ProjectsPage />}
                    />
                    <Route
                        path={RoutePaths.SPRINT}
                        element={<SprintPlanningPage />}
                    />
                </Route>

                <Route element={<NonUsersLayout />}>
                    <Route path={RoutePaths.USERS} element={<UsersPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
